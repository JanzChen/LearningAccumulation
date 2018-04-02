/**
 * Created on 2015年11月4日 下午4:22:33 <br>
 */
package com.finest.addrcloud.bom.util;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

import org.apache.commons.lang3.StringUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 汉字转换位汉语拼音，英文字符不变 .<br>
 *
 * @author cz ljj lzh <br>
 */
public final class Cn2Spell {

    private Cn2Spell() {

    }

    /**
     * 汉字转换位为语拼音首字母，英文字符不变
     *
     * @param chines 汉字
     * @return 拼音
     */
    public static String converterToFirstSpell(String chines) {
        if (StringUtils.isBlank(chines)) {
            return chines;
        }
        String pinyinName = "";
        char[] nameChar = chines.toCharArray();
        HanyuPinyinOutputFormat defaultFormat = new HanyuPinyinOutputFormat();
        defaultFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
        defaultFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
        for (int i = 0; i < nameChar.length; i++) {
            if (nameChar[i] > 128) {
                try {
                    pinyinName += PinyinHelper.toHanyuPinyinStringArray(nameChar[i], defaultFormat)[0].charAt(0);
                } catch (BadHanyuPinyinOutputFormatCombination e) {
                    e.printStackTrace();
                }
            } else {
                pinyinName += nameChar[i];
            }
        }
        return pinyinName.toUpperCase();
    }

    /**
     * 汉字转换为汉语拼音，英文字符不变
     *
     * @param chines 汉字
     * @return 拼音
     */
    public static String converterToSpell(String chines) {
        if (StringUtils.isBlank(chines)) {
            return chines;
        }
        String pinyinName = "";
        int index = 0;
        char[] nameChar = chines.toCharArray();
        HanyuPinyinOutputFormat defaultFormat = new HanyuPinyinOutputFormat();
        defaultFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
        defaultFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
        for (int i = 0; i < nameChar.length; i++) {
            if (nameChar[i] > 128) {
                try {
                    if (index == 0 && i != 0) {
                        pinyinName += "_" + PinyinHelper.toHanyuPinyinStringArray(nameChar[i], defaultFormat)[0];
                    } else {
                        pinyinName += PinyinHelper.toHanyuPinyinStringArray(nameChar[i], defaultFormat)[0];
                    }
                    index++;
                } catch (BadHanyuPinyinOutputFormatCombination e) {
                    e.printStackTrace();
                }
            } else {
                if (index > 0) {
                    pinyinName += "_" + nameChar[i];
                    index = 0;
                } else {
                    pinyinName += nameChar[i];
                }

            }
        }
        return pinyinName.toUpperCase();
    }

    /**
     * 判断是否有中文
     *
     * @param str
     * @return
     */
    public static boolean isChineseChar(String str) {
        boolean temp = false;
        // 即[\\u4e00-\\u9fa5]字符，因代码检查不通过，需如下处理
        StringBuilder sb = new StringBuilder();
        sb.append("[\\u").append("4e00-\\u").append("9fa5]");

        Pattern p = Pattern.compile(sb.toString());
        Matcher m = p.matcher(str);

        if (m.find()) {
            temp = true;
        }
        return temp;
    }

    /**
     * @param args
     */
    // public static void main(String[] args) {
    // String cname = "本地-输入";
    // System.out.println(converterToSpell(cname));
    // }
}
