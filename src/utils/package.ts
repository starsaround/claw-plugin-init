import { execSync } from 'node:child_process';

type PackageInfo = {
  openclawVersion: string;
  pluginSdkVersion: string;
};

/**
 * 获取当前 npm 上最新的 OpenClaw 版本和 SDK 版本
 * 如果获取失败，使用保守的默认版本
 */
export async function getPackageInfo(): Promise<PackageInfo> {
  try {
    const openclawVersion = execSync('npm view openclaw version 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 5000,
    }).trim();

    const pluginSdkVersion = execSync('npm view @openclaw/plugin-sdk version 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 5000,
    }).trim();

    return {
      openclawVersion,
      pluginSdkVersion,
    };
  } catch {
    // 如果网络请求失败，使用已知的稳定版本
    return {
      openclawVersion: '2026.3.24-beta.2',
      pluginSdkVersion: '2026.3.24-beta.2',
    };
  }
}
