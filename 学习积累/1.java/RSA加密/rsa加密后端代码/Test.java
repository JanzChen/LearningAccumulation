package com.unicom.SingleSignOn.singleLogin.util.RSA;

import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;

import org.apache.commons.codec.binary.Base64;

public class Test {

	public static void main(String[] args) throws NoSuchAlgorithmException, InvalidKeySpecException {
//		KeyPair kp=RSAUtils.generateRSAKeyPair();
//		System.out.println("公钥:"+new String(Base64.encodeBase64(kp.getPublic().getEncoded())));
//		System.out.println("密钥:"+new String(Base64.encodeBase64(kp.getPrivate().getEncoded())));
		
		String pubKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsm7vXjYGsqQnyiz4C1p06m8tloIhP1FJgqFAmJXXX/yonYKKOfA0VFWV26UTD34ww6S0ODsCyR1eFd8EX/JVRaicgt1L9e0ItWjgrSJR5LMLqwqLeZGDIIewsbPbyU66GWjJR486fa4eytEYzPmZ+qaaTonNZEFq/5tS9Cxm7nQIDAQAB";
		String priKey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKybu9eNgaypCfKLPgLWnTqby2WgiE/UUmCoUCYlddf/Kidgoo58DRUVZXbpRMPfjDDpLQ4OwLJHV4V3wRf8lVFqJyC3Uv17Qi1aOCtIlHkswurCot5kYMgh7Cxs9vJTroZaMlHjzp9rh7K0RjM+Zn6pppOic1kQWr/m1L0LGbudAgMBAAECgYAv3PtomU+1Dia5AA2RAewVfXAYXTyPTmQNc37OJSMZYyNQSgaplhKWnxlEsQilfA7G3VHmDQc4KHpHg16jBSJuPNeFRcjtIuG6xH97TcJkwhcr/11Mr7kBG2YHfE/DLBWRy3el34IxKR3uksDg7K7MSDx28CgPt/UWTXLkwm5GzQJBAOlKnRo+4Q8lAdrCOaVU9SyQhVrij9n5zDJQslXigg2qQlEUt5na+tbrU3AbvLlnNj4IUBzLbG7veYdv3Vn7718CQQC9aPVN2fYxgCKFeOepKzkqKZrNCAWrTKTm3x+epeRzI/Lhf0pCZnglc0kDdWxs6aHFzkFQ2CxqWznwxHM0YIKDAkBsafhIUiBU4WXTO59+bdTiOOdALTmcmrGCUG4P64t0vkLDW1VXcqRPbF0CJGG353cVrNdOClsB0tgvUJUVVDcRAkB+pqYQboQuyU1MDnJpLdvFk5hNLOYNiuxg7CVKggbl7s3DdsgC6l3APPw/cc8UbIydpbMLCeF5JJLzqYiXJ0ldAkEAkDK3mC908na9dvGqcS9X9+wE+2kwuZxcR2uvolHIrNWDDPrkRZXIrUqIHqL6WAU3HNzKYFm0bJaeS/48fTuoFQ==";
		PublicKey publicKey = RSAUtils.getPublicKey(Base64.decodeBase64(pubKey));
		PrivateKey privateKey = RSAUtils.getPrivateKey(Base64.decodeBase64(priKey));
		String jiamiStr = "fXiKdnFAKdhUnjGPcDKJLL87JHb9c1bWE7qUvk+FwKye629sRDxjEyms9LGC4HNEmYf0Hv+NYt75obdS2LkAnNs7OmvxUKJi+LEfN6xucDgOrpkM8fxLSBt23fShwI7douMi2geUnnFg4SzGE+uFojzV/B5CbpdfuNqSmYP38hY=";
		byte[] jiamiByte = RSAUtils.decryptData(Base64.decodeBase64(jiamiStr), privateKey);
		
		System.out.println(new String(jiamiByte));
	}
}
