/**
 * Created on 2017年8月8日 上午11:36:14 <br>
 */
package com.ascf.di.common.util;

import com.alibaba.druid.pool.DruidDataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

/**
 * druid数据库连接池辅助类.<br>
 * 
 * @author jjp <br>
 */
public class AdsUtils {

    // 日志连接对象
    private static final Logger log = LoggerFactory.getLogger(AdsUtils.class);

    // 连接ADS数据库数据源
    private static DruidDataSource adsDataSource = new DruidDataSource();
    // 连接池对象
    // private static DruidPooledConnection POOLED_CONNECTION;
    // 放置数据库连接的局部变量
    private static ThreadLocal<Connection> container = new ThreadLocal<Connection>();
    // 当前连接对象
    private Connection connection;

    static {

        initDs();

    }

    private static void initDs() {

        try {

            // ADS
            String url = "jdbc:mysql://" + ConfigReader.getProperty("ads", "ads.ip") + ":"
                    + ConfigReader.getProperty("ads", "ads.port") + "/" + ConfigReader.getProperty("ads", "ads.dbname");
            String userName = ConfigReader.getProperty("ads", "ads.username");
            String password = ConfigReader.getProperty("ads", "ads.userpwd");

            // DruidDataSource adsDataSource = new DruidDataSource();
            adsDataSource.setDriverClassName(ConstantUtil.ADS_DRIVER_NAME);
            adsDataSource.setUsername(userName);
            adsDataSource.setPassword(password);
            adsDataSource.setUrl(url);
            // 连接数配置
            adsDataSource.setInitialSize(3);
            adsDataSource.setMinIdle(1);
            adsDataSource.setMaxActive(5);
            adsDataSource.setTestOnBorrow(true);
            adsDataSource.setTestOnReturn(true);
            // destory线程检测时间,隔多久检测一次连接有效性(单位:毫秒)
            adsDataSource.setTimeBetweenEvictionRunsMillis(30000);
            // 连接生存最小时间(单位 :毫秒)
            adsDataSource.setMinEvictableIdleTimeMillis(1500000);
            // for mysql
            adsDataSource.setPoolPreparedStatements(false);
            // 使用心跳语句检测空闲连接
            adsDataSource.setTestWhileIdle(true);
            adsDataSource.setValidationQuery("show status like '%Service_Status%';");
            // 断开重连时间,不要设置过短
            adsDataSource.setTimeBetweenConnectErrorMillis(10000);

            // 启用监控统计功能
            adsDataSource.setFilters("stat");

            // ADS_DATASOURCE = adsDataSource;
            // POOLED_CONNECTION = ADS_DATASOURCE.getConnection();

        } catch (Exception e) {
            log.error("连接池初始化异常,异常信息:" + e.getMessage());
        }

    }

    private AdsUtils() {

    }

    /**
     * 获取连接方法
     * 
     * @return
     */
    private Connection getConnection() {

        Connection con = null;

        try {

            // if (POOLED_CONNECTION.isClosed()) {
            // initDs();
            // // System.out.println("重新初始化连接池信息....");
            // }

            // System.out.print(POOLED_CONNECTION.isClosed());
            // System.out.print("\t");
            // System.out.println(POOLED_CONNECTION.isDisable());

            // con = DataSourceUtils.getConnection(ADS_DATASOURCE);
            con = adsDataSource.getConnection();
            container.set(con);
        } catch (Exception e) {
            log.error("获取ADS连接异常,异常信息:" + e.getMessage());
        }

        return con;
    }

    /**
     * 获取ADS连接
     * 
     * @return
     */
    public static AdsUtils getAdsUtils() {

        AdsUtils adsUtils = new AdsUtils();
        adsUtils.connection = adsUtils.getConnection();
        return adsUtils;
    }

    /**
     * 连接关闭方法
     */
    public void close() {
        try {
            Connection con = container.get();
            if (con != null) {
                con.close();
            }
            // this.connection.close();
        } catch (Exception e) {
            log.error("数据库连接关闭异常,异常信息:" + e.getMessage());
        } finally {
            try {
                container.remove();
            } catch (Exception e2) {
                log.error("移除共享变量异常,异常信息:" + e2.getMessage());
            }
        }
    }

    /**
     * SQL更新语句
     * 
     * @param sql
     * @param params
     * @return
     */
    public int executeUpdate(String sql, Object[] params) {

        int count = 0;

        try {
            PreparedStatement pstm = connection.prepareStatement(sql);
            for (int i = 0; i < params.length; i++) {
                pstm.setObject(i + 1, params[i]);
            }
            count = pstm.executeUpdate();
        } catch (SQLException e) {
            log.error("数据执行出错：" + e);
        } finally {
            close();
        }
        return count;
    }

    /**
     * 批量导入
     * 
     * @param sql
     * @param params
     * @return
     */
    public int executeBatch(String sql, List<Object[]> paramsList) {
        int count = 0;
        try {
            PreparedStatement pstm = connection.prepareStatement(sql);
            for (Object[] params : paramsList) {
                for (int i = 0; i < params.length; i++) {
                    pstm.setObject(i + 1, params[i]);
                }
                pstm.addBatch();
                count++;
            }
            pstm.executeBatch();
        } catch (SQLException e) {
            log.error("批量导入出错：" + e);
        } finally {
            close();
        }
        return count;
    }

    /**
     * 查询结果集
     * 
     * @param sql
     * @param params
     * @return
     */
    private ResultSet executeQueryRS(String sql, Object[] params) {

        ResultSet resultSet = null;

        try {
            if (connection == null || connection.isClosed()) {
                connection = getConnection();
            }
            PreparedStatement pstm = connection.prepareStatement(sql);
            if (null != params) {
                for (int i = 0; i < params.length; i++) {
                    pstm.setObject(i + 1, params[i]);
                }
            }
            resultSet = pstm.executeQuery();
        } catch (SQLException e) {
            log.error("查询结果集出错：" + e);
        }

        return resultSet;
    }

    /**
     * 获取结果集，并将结果放在List中
     * 
     * @param sql SQL语句
     * @return List结果集
     */
    public List<Object> excuteQuery(String sql, Object[] params) {
        log.debug("execute sql : " + sql);
        // 获取结果
        ResultSet rs = executeQueryRS(sql, params);

        List<Object> list = new Vector<Object>();

        if (rs == null) {
            // TODO 2018-01-08 测试修复结果集为空的BUG
            return list;
        }

        ResultSetMetaData rsmd = null;
        int columnCount = 0;
        try {
            rsmd = rs.getMetaData();
            columnCount = rsmd.getColumnCount();
        } catch (SQLException e1) {
            log.error("数据库访问执行异常,异常信息:" + e1.getMessage());
        }

        try {

            while (rs.next()) {
                Map<String, Object> map = new HashMap<String, Object>();
                for (int i = 1; i <= columnCount; i++) {
                    map.put(rsmd.getColumnLabel(i), rs.getObject(i));
                }
                list.add(map);
            }
        } catch (SQLException e) {
            log.error("查询结果集,将转list出错：" + e);
        }

        // 关闭连接
        close();
        return list;
    }

}
