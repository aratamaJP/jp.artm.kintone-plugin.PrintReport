// src/services/LicenseService.ts
const API_ENDPOINT = 'https://lm.artm.jp/api/verify/';
const PURCHASE_URL = 'https://www.artm.jp/kintone-plugin/print-report#purchase';

type VerifyResult = {
  status: 'valid' | 'invalid' | 'expired';
  message: string;
};

/**
 * ライセンスキーを検証する
 * @param licenseKey ライセンスキー
 * @returns 検証結果
 */
export const verifyLicense = async (licenseKey: string): Promise<VerifyResult> => {
  if (!licenseKey) {
    return {
      status: 'invalid',
      message: 'ライセンスキーが設定されていません。',
    };
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ license_key: licenseKey }),
    });

    if (!response.ok) {
      console.error('Network response was not ok', response);
      return {
        status: 'invalid',
        message: `ライセンス認証サーバーとの通信に失敗しました。(HTTP ${response.status})`,
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying license:', error);
    return {
      status: 'invalid',
      message: 'ライセンス認証サーバーとの通信に失敗しました。',
    };
  }
};

/**
 * ライセンス購入ページのURLを取得する
 * @returns URL
 */
export const getPurchaseUrl = (): string => {
  return PURCHASE_URL;
};
