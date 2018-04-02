/**
 * Created on 2017年9月1日 上午11:26:51 <br>
 */
package com.ascf.di.common.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 日期辅助类.<br>
 * 
 * @author hkb <br>
 */
public class DateUtil {

    // 线程安全的日期格式对象:年月日
    private static final ThreadLocal<DateFormat> nyr = new ThreadLocal<DateFormat>() {

        @Override
        protected DateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd");
        }

    };

    // 线程安全的日期格式对象
    private static final ThreadLocal<DateFormat> df = new ThreadLocal<DateFormat>() {

        @Override
        protected DateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }

    };

    /**
     * 格式化年月日
     * 
     * @param date
     * @return
     */
    public static String formatNyr(Date date) {
        return nyr.get().format(date);
    }

    /**
     * 格式化年月日包含时分秒
     * 
     * @param date
     * @return
     */
    public static String formatDate(Date date) {
        return df.get().format(date);
    }

    /**
     * 获取当前时间的年月日
     * 
     * @return
     */
    public static String getYearMonthDay() {
        Date date = new Date();
        return formatNyr(date);
    }

    /**
     * 获取当前日期,包括时分秒
     * 
     * @return
     */
    public static String getCurrentTime() {
        Date date = new Date();
        return formatDate(date);
    }

    /**
     * 获取当前时间的前一周时间
     * 
     * @return
     */
    public static String getPreWeekTime() {
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_WEEK_IN_MONTH, -1);
        date = calendar.getTime();
        return formatDate(date);
    }

    /**
     * 获取当前日期的最末
     * 
     * @return
     */
    public static String getLastWeeHours() {
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        int second = calendar.get(Calendar.SECOND);
        long millisecond = hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000;
        long lastMillis = calendar.getTimeInMillis() - millisecond + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000;
        calendar.setTimeInMillis(lastMillis);
        return formatDate(calendar.getTime());
    }

    /**
     * 获取前一周的时间的凌晨
     * 
     * @return
     */
    public static String getPreWeekWeeHours() {
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_WEEK_IN_MONTH, -1);
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        int second = calendar.get(Calendar.SECOND);
        long millisecond = hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000;
        calendar.setTimeInMillis(calendar.getTimeInMillis() - millisecond);
        return formatDate(calendar.getTime());
    }

    /**
     * 判断开始和结束时间,是否超过3个月
     * 
     * @param startDate
     * @param endDate
     * @return
     */
    public static boolean exceedThreeMonth(Date startDate, Date endDate) {
        // 默认不超过3个月
        boolean flag = true;
        Calendar start = Calendar.getInstance();
        Calendar end = Calendar.getInstance();
        start.setTime(startDate);
        end.setTime(endDate);

        // 设置时间为0时
        start.set(Calendar.HOUR_OF_DAY, 0);
        start.set(Calendar.MINUTE, 0);
        start.set(Calendar.SECOND, 0);
        end.set(Calendar.HOUR_OF_DAY, 0);
        end.set(Calendar.MINUTE, 0);
        end.set(Calendar.SECOND, 0);
        // 两个日期相差的天数
        int result = ((int) (end.getTime().getTime() / 1000) - (int) (start.getTime().getTime() / 1000)) / 3600 / 24;

        if (result > 90) {
            flag = false;
        }
        return flag;
    }

    /**
     * 获取环比同比时间
     * 
     * @param type 0-今年今天的时间 1-昨天的时间 2-去年的时间
     * @return 返回格式<br>
     *         0-今天 2017-09-17 00:00:00,2017-09-17 17:32:02<br>
     *         1-昨天 2017-09-16 00:00:00,2017-09-16 17:32:02<br>
     *         2-去年 2016-09-17 00:00:00,2016-09-17 17:32:02
     */
    public static String getLinkSameTime(int type) {
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        if (type == 0 || type == 1) {
            calendar.add(Calendar.DAY_OF_MONTH, -type);
        } else if (type == 2) {
            // 特殊处理
            calendar.add(Calendar.YEAR, -1);
        }
        String endDate = formatDate(calendar.getTime());
        // 获取凌晨
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        int second = calendar.get(Calendar.SECOND);
        long millisecond = hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000;
        calendar.setTimeInMillis(calendar.getTimeInMillis() - millisecond);
        String startDate = formatDate(calendar.getTime());
        return startDate + "," + endDate;
    }

    /**
     * 获取预警时间
     * 
     * @param type 0-今年的时间 1-去年的时间 2-前年的时间
     * @return 返回格式<br>
     *         0-今天 2017-09-17 00:00:00,2017-09-17 17:32:02<br>
     *         1-去年 2016-09-17 00:00:00,2016-09-17 17:32:02<br>
     *         2-前年 2015-09-17 00:00:00,2015-09-17 17:32:02<br>
     */
    public static String getEarlyWarningTime(int type) {
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.YEAR, -type);
        String endDate = formatDate(calendar.getTime());
        // 获取凌晨
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        int second = calendar.get(Calendar.SECOND);
        long millisecond = hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000;
        calendar.setTimeInMillis(calendar.getTimeInMillis() - millisecond);
        String startDate = formatDate(calendar.getTime());
        return startDate + "," + endDate;
    }

    /**
     * 根据传入的小时类型,获取时间区间,注意:这里目前先写死
     * 
     * @param startHour 设定闲时的开始
     * @param endHour 设定闲时的结束
     * @return 处于闲时,则把当前时间往前推2个小时<br>
     *         处于忙时,则把当前时间往前推30分钟
     */
    public static String getTimebyType(int startHour, int endHour) {
        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR_OF_DAY);

        String start = "";
        String end = formatDate(calendar.getTime());
        if (hour >= startHour && hour <= endHour) {
            // 闲时
            calendar.add(Calendar.HOUR_OF_DAY, -2);
            start = formatDate(calendar.getTime());
        } else {
            // 忙时
            calendar.add(Calendar.MINUTE, -30);
            start = formatDate(calendar.getTime());
        }
        return start + "," + end;
    }

    public static void main(String[] args) {
        System.out.println(getTimebyType(0, 7));
    }

}
