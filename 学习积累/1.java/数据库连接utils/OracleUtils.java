/**
 * Created on 2017年10月29日 上午11:36:14 <br>
 */
package com.ascf.di.common.util;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * druid数据库连接池辅助类.<br>
 * 
 * @author hhj <br>
 */
public class OracleUtils {

    // 日志连接对象
    private static final Logger log = LoggerFactory.getLogger(OracleUtils.class);

    // 连接ORACLE数据库数据源
    private static DruidDataSource ORACLE_DATASOURCE;
    // 连接池对象
    private static DruidPooledConnection POOLED_CONNECTION;
    // 当前连接对象
    private static Connection connection;

    static {

        initDs();

    }

    private static void initDs() {

        try {
        	Class.forName("oracle.jdbc.driver.OracleDriver");
            // oracle
            String url = "jdbc:oracle:thin:@" + ConfigReader.getProperty("oracle", "oracle.ip") + ":"
                    + ConfigReader.getProperty("oracle", "oracle.port") + ":" + ConfigReader.getProperty("oracle", "oracle.dbname");
            String userName = ConfigReader.getProperty("oracle", "oracle.username");
            String password = ConfigReader.getProperty("oracle", "oracle.userpwd");
            connection= DriverManager.getConnection(url, userName, password);

        } catch (Exception e) {
            log.error("连接初始化异常,异常信息:" + e.getMessage());
        }

    }

    private OracleUtils() {

    }

    /**
     * 获取连接方法
     * 
     * @return
     */
    private synchronized Connection getConnection() {

        Connection con = null;

        try {

            if (POOLED_CONNECTION.isClosed()) {
                initDs();
                // System.out.println("重新初始化连接池信息....");
            }
            con = POOLED_CONNECTION.getConnection();

        } catch (Exception e) {
            log.error("获取ORACLE连接异常,异常信息:" + e.getMessage());
        }

        return con;
    }

    /**
     * 获取Oracle连接
     * 
     * @return
     */
    public static OracleUtils getOracleUtils() {

        OracleUtils oracleUtils = new OracleUtils();
        //oracleUtils.getConnection();
        return oracleUtils;
    }

    /**
     * 连接关闭方法
     */
    public void close() {
        try {
            // this.connection.close();
        } catch (Exception e) {
            log.error("数据库连接关闭异常,异常信息:" + e.getMessage());
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
        	if(null==connection){
        		 initDs();
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
        ResultSetMetaData rsmd = null;
        int columnCount = 0;
        try {
            rsmd = rs.getMetaData();
            columnCount = rsmd.getColumnCount();
        } catch (SQLException e1) {
            log.error("数据库访问执行异常,异常信息:" + e1.getMessage());
        }

        List<Object> list = new ArrayList<Object>();

        try {
            while (rs.next()) {
                Map<String, Object> map = new LinkedHashMap<String, Object>();
                for (int i = 1; i <= columnCount; i++) {
                    map.put(rsmd.getColumnLabel(i), rs.getObject(i));
                }
                list.add(map);
            }
        } catch (SQLException e) {
            log.error("查询结果集,将转list出错：" + e);
        }

        return list;
    }

}
