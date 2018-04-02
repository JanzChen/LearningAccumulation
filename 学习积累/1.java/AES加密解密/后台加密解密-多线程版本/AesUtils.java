/**
 * Created on 2018年1月9日 下午3:15:09 <br>
 */
package com.ascf.di.common.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

/**
 * AES加密解密-支持并发<br>
 *
 * @author hkb <br>
 */
public final class AesUtils {

    private AesUtils() {
    }

    private static Logger log = LoggerFactory.getLogger(AesUtils.class);
    // key对象
    private static SecretKey secretKey = null;
    // 私鈅加密对象Cipher
    private static ThreadLocal<Cipher> cipherContainer = new ThreadLocal<Cipher>() {
        @Override
        protected Cipher initialValue() {
            try {
                // 获得一个私鈅加密类Cipher，DESede-》AES算法，ECB是加密模式，PKCS5Padding是填充方式
                return Cipher.getInstance("AES/ECB/PKCS5Padding");
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
            return null;
        }
    };
    // 密钥
    private static final String KEY_STRING = "finest.com.cn_ac";

    static {
        // 获取密钥
        secretKey = new SecretKeySpec(KEY_STRING.getBytes(), "AES");
    }

    /**
     * AES加密
     *
     * @param message
     * @return
     */
    public static String aesEncrypt(String message) {
        // AES加密字符串
        String result = "";
        // 去掉换行符后的加密字符串
        String newResult = "";
        try {
            Cipher cipher = cipherContainer.get();
            // 设置工作模式为加密模式，给出密钥
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            // 执行加密操作
            byte[] resultBytes = cipher.doFinal(message.getBytes("UTF-8"));
            // 进行BASE64编码
            result = Base64.encodeBase64String(resultBytes);
            // 去掉加密串中的换行符
            newResult = filter(result);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException("AES加密失败！");
        }
        return newResult;
    }

    /**
     * AES解密
     *
     * @param message
     * @return @
     */
    public static String aesDecrypt(String message) {
        if (StringUtils.isBlank(message)) {
            return message;
        }
        String result = "";
        try {
            Cipher cipher = cipherContainer.get();
            // 进行BASE64解码
            byte[] messageBytes = Base64.decodeBase64(message);
            // 设置工作模式为解密模式，给出密钥
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            // 执行解密操作
            byte[] resultBytes = cipher.doFinal(messageBytes);
            result = new String(resultBytes, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("AES解密失败！");
        }
        return result;
    }

    /**
     * 去掉加密字符串换行符
     *
     * @param str
     * @return
     */
    public static String filter(String str) {
        String output = "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            int asc = str.charAt(i);
            if (asc != 10 && asc != 13) {
                sb.append(str.subSequence(i, i + 1));
            }
        }
        output = new String(sb);
        return output;
    }

    /**
     * 测试
     *
     * @param args @
     */
    public static void main(String[] args) {
        Thread t = null;
        for (int i = 0; i < 10000; i++) {
            t = new Thread(new MyThread());
            t.start();
        }
    }
}

class MyThread implements Runnable {

    @Override
    public void run() {
        System.out.println(AesUtils.aesEncrypt("addrCloud"));
        System.out.println(AesUtils.aesDecrypt("yoIcJxf/1zFyEaw/1XT7Pg=="));
    }
}