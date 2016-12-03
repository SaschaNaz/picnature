declare namespace Picnature {
    type Signature = Uint8Array | string;
    const signatureMap: Map<string, Signature[]>;
    function map(blob: Blob): Promise<string>;
}
