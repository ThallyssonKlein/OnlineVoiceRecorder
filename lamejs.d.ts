declare module 'lamejs' {
  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number)
    encodeBuffer(left: Int16Array, right?: Int16Array): Uint8Array<ArrayBuffer>
    flush(): Uint8Array<ArrayBuffer>
  }
}
