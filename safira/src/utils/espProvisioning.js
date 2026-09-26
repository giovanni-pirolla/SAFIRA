import { fromByteArray } from 'base64-js';

function encodeVarint(value) {
  const bytes = [];

  while (value > 127) {
    bytes.push((value & 0x7f) | 0x80);
    value = Math.floor(value / 128);
  }

  bytes.push(value);

  return bytes;
}

function encodeLengthDelimited(fieldNumber, data) {
  const key = (fieldNumber << 3) | 2;

  return [
    key,
    ...encodeVarint(data.length),
    ...data,
  ];
}

function stringToBytes(value) {
  return Array.from(new TextEncoder().encode(value));
}

function bytesToBase64(bytes) {
  return fromByteArray(Uint8Array.from(bytes));
}

function createSetWifiConfigPayload(ssid, password) {
  const ssidBytes = stringToBytes(ssid);
  const passwordBytes = stringToBytes(password);

  const command = [
    ...encodeLengthDelimited(1, ssidBytes),
    ...encodeLengthDelimited(2, passwordBytes),
  ];

  return [
    // msg = TypeCmdSetWifiConfig = 2
    0x08,
    0x02,

    // cmd_set_wifi_config = field 12
    ...encodeLengthDelimited(12, command),
  ];
}

function createApplyWifiConfigPayload() {
  return [
    // msg = TypeCmdApplyWifiConfig = 4
    0x08,
    0x04,

    // cmd_apply_wifi_config = field 14
    0x72,
    0x00,
  ];
}

function createGetWifiStatusPayload() {
  return [
    // msg = TypeCmdGetWifiStatus = 0
    0x08,
    0x00,

    // cmd_get_wifi_status = field 10
    0x52,
    0x00,
  ];
}

export {
  createSetWifiConfigPayload,
  createApplyWifiConfigPayload,
  createGetWifiStatusPayload,
  bytesToBase64,
};