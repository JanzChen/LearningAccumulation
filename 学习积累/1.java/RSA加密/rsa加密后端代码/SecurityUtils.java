package test2;
import java.io.FileInputStream;  
import java.io.FileNotFoundException;  
import java.io.InputStream;  
import java.security.PrivateKey;  
import java.security.PublicKey;  
  
public class SecurityUtils {  
    /** 
     * ���� 
     * @param cipherText ���� 
     * @return ���ؽ��ܺ���ַ��� 
     * @throws Exception  
     */  
    public static String decrypt(String cipherText) throws Exception{  
         // ���ļ��еõ�˽Կ  
        FileInputStream inPrivate = new FileInputStream(  
        		"D:\\work\\test" + "/pkcs8_private_key.pem");  
        PrivateKey privateKey = RSAUtils.loadPrivateKey(inPrivate);  
        byte[] decryptByte = RSAUtils.decryptData(Base64Utils.decode(cipherText), privateKey);  
        String decryptStr = new String(decryptByte,"utf-8");  
        return decryptStr;  
    }  
    /** 
     * ���� 
     * @param plainTest ���� 
     * @return  ���ؼ��ܺ������ 
     * @throws Exception  
     */  
    public static String encrypt(String plainTest) throws Exception{  
        FileInputStream inPublic = new FileInputStream(  
                "G:\\work\\test" + "/rsa_public_key.pem");
        PublicKey publicKey = RSAUtils.loadPublicKey(inPublic);  
        // ����  
        byte[] encryptByte = RSAUtils.encryptData(plainTest.getBytes(), publicKey);  
        String afterencrypt = Base64Utils.encode(encryptByte);  
        return afterencrypt;  
    }  
}  