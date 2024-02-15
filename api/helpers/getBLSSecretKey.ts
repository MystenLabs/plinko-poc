// HKDF is a key derivation function that is used to derive secret keys from a private key.
import hkdf from "futoin-hkdf";

export const getBLSSecretKey = (privateKey: string) => {
  // Initial key material (ikm): Directly use the provided `privateKey`.
  const ikm = privateKey;
  // Specify the length of the derived key in bytes. For BLS secret keys, 32 bytes is a common length.
  const length = 32;
  // Define a `salt` value to be used in the HKDF process.
  const salt = "plinko";
  const info = "bls-signature";
  const hash = "SHA-256";
  const derivedSecretKey = hkdf(ikm, length, { salt, info, hash });
  // Convert the derived secret key (which is in the form of a byte array) to a Uint8Array and return it.
  return Uint8Array.from(derivedSecretKey);
};
