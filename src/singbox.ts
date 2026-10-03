import type { VNode } from './parser';
import { API_PORT } from './config';

const clean = (o: any) => JSON.parse(JSON.stringify(o)); // undefined ها حذف میشن

/** کانفیگ اصلی sing-box 1.14 (فرمت جدید DNS و route actions) */
/**
 * v2.5 · Split tunnel ایران
 * سایت‌ها و IPهای ایرانی مستقیم (بدون VPN) میرن؛ بانک، شاپرک، سایت‌های .ir درست کار می‌کنن.
 * لیست‌ها از Chocolate4U/Iran-sing-box-rules (با میرور jsDelivr)، از داخل تونل دانلود و کش میشن.
 */
const IR_RULES = 'https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set';
const IR_RULES_CDN = 'https://cdn.jsdelivr.net/gh/Chocolate4U/Iran-sing-box-rules@rule-set';
/** دامنه‌هایی که حتی بدون دانلود لیست، مستقیم میرن (fallback) */
export const IR_DOMAINS = ['ir', 'shaparak.ir', 'digikala.com', 'aparat.com', 'snapp.ir', 'divar.ir', 'cafebazaar.ir', 'torob.com', 'filimo.com', 'namava.ir', 'eitaa.com', 'rubika.ir', 'bale.ai'];

export type BuildOpts = {
  /** split tunnel ایران روشن باشه */
  bypassIran?: boolean;
  /** لیست کامل geoip/geosite ایران دانلود بشه؛ false = فقط لیست داخلی (اگه دانلود نشد) */
  remoteRules?: boolean;
  /** از کدوم میرور لیست‌ها گرفته بشه */
  cdn?: boolean;
};

export function buildConfig(node: VNode, mode: 'tun' | 'proxy', port: number, opts: BuildOpts = {}) {
  const { bypassIran = false, remoteRules = true, cdn = false } = opts;
  const base = cdn ? IR_RULES_CDN : IR_RULES;
  const useSets = bypassIran && remoteRules;
  const ruleSets = useSets
    ? [
        { type: 'remote', tag: 'geoip-ir', format: 'binary', url: `${base}/geoip-ir.srs`, download_detour: 'proxy', update_interval: '3d' },
        { type: 'remote', tag: 'geosite-ir', format: 'binary', url: `${base}/geosite-ir.srs`, download_detour: 'proxy', update_interval: '3d' },
      ]
    : undefined;
  const irRoute = bypassIran
    ? [
        { domain_suffix: IR_DOMAINS, outbound: 'direct' },
        ...(useSets ? [{ rule_set: ['geosite-ir', 'geoip-ir'], outbound: 'direct' }] : []),
      ]
    : [];
  // دامنه‌های ایرانی با DNS خود سیستم resolve میشن تا IP داخلی (و CDN درست) بگیرن
  const irDns = bypassIran
    ? [
        { domain_suffix: IR_DOMAINS, server: 'dns-local' },
        ...(useSets ? [{ rule_set: ['geosite-ir'], server: 'dns-local' }] : []),
      ]
    : undefined;

  const inbounds: any[] = [
    { type: 'mixed', tag: 'mixed-in', listen: '127.0.0.1', listen_port: port },
  ];
  if (mode === 'tun') {
    inbounds.unshift({
      type: 'tun',
      tag: 'tun-in',
      interface_name: 'MahyarVPN',
      address: ['172.19.0.1/30', 'fdfe:dcba:9876::1/126'],
      mtu: 9000,
      auto_route: true,
      strict_route: true,
      stack: 'mixed',
    });
  }
  return clean({
    log: { level: 'warn', timestamp: true },
    dns: {
      servers: [
        { type: 'https', tag: 'dns-remote', server: '1.1.1.1', detour: 'proxy' },
        { type: 'local', tag: 'dns-local' },
      ],
      rules: irDns,
      final: 'dns-remote',
      strategy: 'prefer_ipv4',
    },
    inbounds,
    outbounds: [
      { ...node.outbound, tag: 'proxy' },
      { type: 'direct', tag: 'direct' },
    ],
    route: {
      rules: [
        { action: 'sniff' },
        { protocol: 'dns', action: 'hijack-dns' },
        { ip_is_private: true, outbound: 'direct' },
        ...irRoute,
      ],
      rule_set: ruleSets,
      final: 'proxy',
      auto_detect_interface: true,
      default_domain_resolver: 'dns-local',
    },
    experimental: {
      clash_api: { external_controller: `127.0.0.1:${API_PORT}` },
      // لیست‌های ایران بعد از اولین دانلود کش میشن (کنار config.json)
      cache_file: useSets ? { enabled: true, path: 'cache.db' } : undefined,
    },
  });
}

/** کانفیگ موقت برای تست پینگ واقعی (همه سرورها با هم، از طریق Clash API) */
export function buildTestConfig(nodes: VNode[]) {
  return clean({
    log: { level: 'error' },
    dns: { servers: [{ type: 'local', tag: 'dns-local' }] },
    outbounds: [
      ...nodes.map((n, i) => ({ ...n.outbound, tag: `n${i}` })),
      { type: 'direct', tag: 'direct' },
    ],
    route: { final: 'direct', auto_detect_interface: true, default_domain_resolver: 'dns-local' },
    // experimental.clash_api رو بک‌اند با یه پورت آزاد اضافه می‌کنه
  });
}
