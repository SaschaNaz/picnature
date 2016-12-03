namespace Picnature {
    export type Signature = Uint8Array | string;
    export const signatureMap = new Map<string, Signature[]>();

    function initialize() {
        signatureMap.set("image/png", [Uint8Array.of(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)]);
        signatureMap.set("image/gif", ["GIF87a", "GIF89a"]);
        signatureMap.set("image/tiff", [
            Uint8Array.of(0x4d, 0x4d, 0x00, 0x2a),
            Uint8Array.of(0x49, 0x49, 0x2a, 0x00)
        ]);
    }

    async function matchSignatures(blob: Blob, signatures: Signature[]) {
        for (let signature of signatures) {
            if (typeof signature === "string") {
                signature = asciiToUint8Array(signature);
            }
            const result = await matchSignature(blob, signature);
            if (result) {
                return true;
            }
        }
    }

    function matchSignature(blob: Blob, signature: Uint8Array) {
        return new Promise<boolean>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(matchArray(reader.result, signature));
            reader.onerror = err => reject(err);
            reader.readAsArrayBuffer(blob.slice(0, signature.length));
        });
    }

    function asciiToUint8Array(text: string) {
        const array = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) {
            array[i] = text.charCodeAt(i);
        }
        return array;
    }

    function matchArray(x: Uint8Array, y: Uint8Array) {
        if (x.length !== y.length) {
            return false;
        }

        for (let i = 0; i < x.length; i++) {
            if (x[i] !== y[i]) {
                return false;
            }
        }

        return true;
    }

    export async function map(blob: Blob) {
        for (const entry of signatureMap) {
            if (await matchSignatures(blob, entry[1])) {
                return entry[0];
            }
        }
    }
}