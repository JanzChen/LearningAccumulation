package test2;

import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;

import org.apache.commons.codec.binary.Base64;

public class Test {

	public static void main(String[] args) throws NoSuchAlgorithmException, InvalidKeySpecException {
//		KeyPair kp=RSAUtils.generateRSAKeyPair();
//		System.out.println("π´‘ø:"+Base64.getEncoder().encodeToString(kp.getPublic().getEncoded()));
//		
//		byte[] jiami=RSAUtils.encryptData("√ÿ√‹".getBytes(), kp.getPublic());
//		System.out.println("º”√‹:"+Base64.getEncoder().encodeToString(jiami));
//		byte[] jiemi=RSAUtils.decryptData(jiami, kp.getPrivate());
//		System.out.println("Ω‚√‹:"+new String(jiemi));
		String pubKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsm7vXjYGsqQnyiz4C1p06m8tloIhP1FJgqFAmJXXX/yonYKKOfA0VFWV26UTD34ww6S0ODsCyR1eFd8EX/JVRaicgt1L9e0ItWjgrSJR5LMLqwqLeZGDIIewsbPbyU66GWjJR486fa4eytEYzPmZ+qaaTonNZEFq/5tS9Cxm7nQIDAQAB";
		String priKey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKybu9eNgaypCfKLPgLWnTqby2WgiE/UUmCoUCYlddf/Kidgoo58DRUVZXbpRMPfjDDpLQ4OwLJHV4V3wRf8lVFqJyC3Uv17Qi1aOCtIlHkswurCot5kYMgh7Cxs9vJTroZaMlHjzp9rh7K0RjM+Zn6pppOic1kQWr/m1L0LGbudAgMBAAECgYAv3PtomU+1Dia5AA2RAewVfXAYXTyPTmQNc37OJSMZYyNQSgaplhKWnxlEsQilfA7G3VHmDQc4KHpHg16jBSJuPNeFRcjtIuG6xH97TcJkwhcr/11Mr7kBG2YHfE/DLBWRy3el34IxKR3uksDg7K7MSDx28CgPt/UWTXLkwm5GzQJBAOlKnRo+4Q8lAdrCOaVU9SyQhVrij9n5zDJQslXigg2qQlEUt5na+tbrU3AbvLlnNj4IUBzLbG7veYdv3Vn7718CQQC9aPVN2fYxgCKFeOepKzkqKZrNCAWrTKTm3x+epeRzI/Lhf0pCZnglc0kDdWxs6aHFzkFQ2CxqWznwxHM0YIKDAkBsafhIUiBU4WXTO59+bdTiOOdALTmcmrGCUG4P64t0vkLDW1VXcqRPbF0CJGG353cVrNdOClsB0tgvUJUVVDcRAkB+pqYQboQuyU1MDnJpLdvFk5hNLOYNiuxg7CVKggbl7s3DdsgC6l3APPw/cc8UbIydpbMLCeF5JJLzqYiXJ0ldAkEAkDK3mC908na9dvGqcS9X9+wE+2kwuZxcR2uvolHIrNWDDPrkRZXIrUqIHqL6WAU3HNzKYFm0bJaeS/48fTuoFQ==";
		PublicKey publicKey = RSAUtils.getPublicKey(Base64.decodeBase64(pubKey));
		PrivateKey privateKey = RSAUtils.getPrivateKey(Base64.decodeBase64(priKey));
		String jiamiStr = "fXiKdnFAKdhUnjGPcDKJLL87JHb9c1bWE7qUvk+FwKye629sRDxjEyms9LGC4HNEmYf0Hv+NYt75obdS2LkAnNs7OmvxUKJi+LEfN6xucDgOrpkM8fxLSBt23fShwI7douMi2geUnnFg4SzGE+uFojzV/B5CbpdfuNqSmYP38hY=";
		byte[] jiamiByte = RSAUtils.decryptData(Base64.decodeBase64(jiamiStr), privateKey);
		
		System.out.println(new String(jiamiByte));
//		try {
//			System.out.println(SecurityUtils.decrypt(SecurityUtils.encrypt("√ÿ√‹")));
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
		
//		String publicKeyString="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZowUpS7bAa+GL+MRNmwm5r26rdxEVN9oEQKtkA52tcMtemxtV4IqK1j3H/dl0ERe9RUgtxIkSaxPJQttaRKqtuQDjjZpo4oy3pHmphcmmIo2PJwXmEOZlssfmVWfm9eJmUc1C2UnPaO5N12kF1wniWjzDe1DOWtjjQ5cuk9MN7QIDAQAB";
//		String privateKeyString="MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBANmjBSlLtsBr4Yv4xE2bCbmvbqt3ERU32gRAq2QDna1wy16bG1XgiorWPcf92XQRF71FSC3EiRJrE8lC21pEqq25AOONmmjijLekeamFyaYijY8nBeYQ5mWyx+ZVZ+b14mZRzULZSc9o7k3XaQXXCeJaPMN7UM5a2ONDly6T0w3tAgMBAAECgYEArklpwbdbg98hAZnXgpqNAEGoa/HvIUHX+x3a4z4uEI5Kntmx22T1LdgCI917PgLOMwl/kv9YEgLkFoHO7gwdbYWga4Szbf5Q+qbF/9pBpS3UtmiuGn89rutmdpaPRs08HnlBKEVHVqoWt/AQGLuQnpEnvT/3QJqGsrvz68wYioECQQDwv+Spw/xWlYiTBIHf5g2TiL7ANbcRTxk7d6VFU4PfZyY5x1ixmfJILHZOd1vjyML57O6LLiQlzm/OlR5CJYuhAkEA52xRvkJvGBvhJaOAGakVv8rKtRRUffzfYlPUYZA927HoPk4+m0rB9On3YgnqyYS6UdaHiL0mnGT4rPAxXGl+zQJAQMZQnsClhyJKkcvXqcc7BeP39r09GUIf9tkVNZbn11boeQlCut5ByttzpV8F8T6V/yqZcAclIKrveDS05HU3oQJAPuh0BAsdFemmN0wNq2wKLHucxMKFAUZ3FsyA5BCIsCrZXe55GE+nD8N16uGVQDhjSZHOf/4i+8p6ys/0KxHGVQJBAOBUVoRLzgYYHFYKAH/ujZZdhtJF/IXHEewwkXAP2uScBr09o7WElCQNWRxMQZ/WjVIuH2fP3jOpSxXAUe1dQnM=";
//		byte[] publicKeyByte=Base64.getDecoder().decode(publicKeyString);
//		for (byte b : publicKeyByte) {
//			System.out.print(b);
//		}
	}
}
