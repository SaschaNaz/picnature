var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var Picnature;
(function (Picnature) {
    Picnature.signatureMap = new Map();
    initialize();
    function initialize() {
        Picnature.signatureMap.set("image/jpeg", [
            Uint8Array.of(0xFF, 0xD8, 0xFF, 0xDB),
            Uint8Array.of(0xFF, 0xD8, 0xFF, 0xE0),
            Uint8Array.of(0xFF, 0xD8, 0xFF, 0xE1)
        ]);
        Picnature.signatureMap.set("image/png", [Uint8Array.of(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)]);
        Picnature.signatureMap.set("image/gif", ["GIF87a", "GIF89a"]);
        Picnature.signatureMap.set("image/tiff", [
            Uint8Array.of(0x4d, 0x4d, 0x00, 0x2a),
            Uint8Array.of(0x49, 0x49, 0x2a, 0x00)
        ]);
    }
    function matchSignatures(blob, signatures) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let signature of signatures) {
                if (typeof signature === "string") {
                    signature = asciiToUint8Array(signature);
                }
                const result = yield matchSignature(blob, signature);
                if (result) {
                    return true;
                }
            }
        });
    }
    function matchSignature(blob, signature) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(matchArray(new Uint8Array(reader.result), signature));
            reader.onerror = err => reject(err);
            reader.readAsArrayBuffer(blob.slice(0, signature.length));
        });
    }
    function asciiToUint8Array(text) {
        const array = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) {
            array[i] = text.charCodeAt(i);
        }
        return array;
    }
    function matchArray(x, y) {
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
    function map(blob) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const entry of Picnature.signatureMap) {
                if (yield matchSignatures(blob, entry[1])) {
                    return entry[0];
                }
            }
        });
    }
    Picnature.map = map;
})(Picnature || (Picnature = {}));
//# sourceMappingURL=picnature.js.map