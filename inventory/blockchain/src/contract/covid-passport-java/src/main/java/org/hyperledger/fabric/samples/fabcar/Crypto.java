/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

package org.hyperledger.fabric.samples.fabcar;

import org.bouncycastle.asn1.sec.SECNamedCurves;
import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.crypto.params.ECDomainParameters;
import org.bouncycastle.crypto.params.ECPublicKeyParameters;
import org.bouncycastle.crypto.signers.ECDSASigner;
import org.hyperledger.fabric.contract.ContractInterface;

import java.math.BigInteger;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;

public final class Crypto implements ContractInterface {

    public static boolean validateSignature(byte[] message, BigInteger r, BigInteger s, PublicKey pub) {
        X9ECParameters x9ecparams = SECNamedCurves.getByName("secp256r1");
        ECDomainParameters Curve = new ECDomainParameters(x9ecparams.getCurve(), x9ecparams.getG(),
                x9ecparams.getN(), x9ecparams.getH());
        ECDSASigner signer = new ECDSASigner();
        ECPublicKeyParameters params = new ECPublicKeyParameters(Curve.getCurve().decodePoint(pub.getEncoded()),
                Curve);
        signer.init(false, params);
        try {
            return signer.verifySignature(message, r, s);
        } catch (NullPointerException e) {
            // Bouncy Castle contains a bug that can cause NPEs given specially
            // crafted signatures. Those signatures
            // are inherently invalid/attack sigs so we just fail them here
            // rather than crash the thread.
            System.out.println("Caught NPE inside bouncy castle");
            e.printStackTrace();
            return false;
        }
    }

    public static byte[] hash(byte[] b) {
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("SHA-256");
            md.update(b);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return md.digest();
    }

    public static PublicKey UnmarshalPublicKey(byte[] encodedKey){
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("EC");
            return keyFactory.generatePublic(new PKCS8EncodedKeySpec(encodedKey));
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static PrivateKey UnmarshalPrivateKey(byte[] encodedKey){
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("EC");
            return keyFactory.generatePrivate(new PKCS8EncodedKeySpec(encodedKey));
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            e.printStackTrace();
        }
        return null;
    }
}
