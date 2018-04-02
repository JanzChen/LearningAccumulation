/**
 * Created on 2017年7月28日 下午7:37:59 <br>
 */
package com.ascf.di.common.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * jdbc工具类.<br>
 * 
 * @author hhj <br>
 */
@Deprecated
public class JdbcUtils {

    private static final Logger LOG = LoggerFactory.getLogger(JdbcUtils.class);
    public Connection connection = null;
    private PreparedStatement pstm = null;

    // 是否是ADS连接,该属性用于确定当前生成连接的类型
    private boolean isAds;

    public boolean isAds() {
        return isAds;
    }

    public void setAds(boolean isAds) {
        this.isAds = isAds;
    }

    /**
     * 创建结果集对象
     */
    private ResultSet resultSet = null;

    public JdbcUtils(String driverName, String url, String userName, String password) {
        if (driverName.equalsIgnoreCase(ConstantUtil.ADS_DRIVER_NAME)) {
            this.isAds = true;
        } else {
            this.isAds = false;
        }
        try {
            Class.forName(driverName);
            Properties connectionProps = new Properties();
            connectionProps.put("user", userName);
            connectionProps.put("password", password);
            connection = DriverManager.getConnection(url, connectionProps);
        } catch (ClassNotFoundException e) {
            LOG.error("类没有找到异常：" + e);
        } catch (SQLException e) {
            LOG.error("SQL异常:" + e);
        }
    }

    /**
     * 创建表，如存在先删除
     * 
     * @param tableName
     * @param fieldsql
     * @return
     */
    public boolean createTable(String tableName, String fieldsql) {
        boolean flag = false;
        Statement stm = null;
        try {
            stm = connection.createStatement();
            // 如果存在，先删除
            stm.execute("drop table if exists " + tableName);
            stm.execute("create table " + tableName + " (" + fieldsql + ")");
        } catch (SQLException e) {
            LOG.error("创建表出错：" + e);
        } finally {
            if (null != stm) {
                try {
                    stm.close();
                } catch (SQLException e) {
                    LOG.error("Statement关闭出错：" + e);
                }
            }
        }
        return flag;
    }

    /**
     * 单个更新(insert/delete)操作
     * 
     * @param sql
     * @param params
     * @return
     */
    public int executeUpdate(String sql, Object[] params) {
        int count = 0;
        try {
            pstm = connection.prepareStatement(sql);
            for (int i = 0; i < params.length; i++) {
                pstm.setObject(i + 1, params[i]);
            }
            count = pstm.executeUpdate();
        } catch (SQLException e) {
            LOG.error("数据执行出错：" + e);
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
            pstm = connection.prepareStatement(sql);
            for (Object[] params : paramsList) {
                for (int i = 0; i < params.length; i++) {
                    pstm.setObject(i + 1, params[i]);
                }
                pstm.addBatch();
                count++;
            }
            pstm.executeBatch();
        } catch (SQLException e) {
            LOG.error("批量导入出错：" + e);
        }
        return count;
    }

    /**
     * 获取结果集，并将结果放在List中
     * 
     * @param sql SQL语句
     * @return List结果集
     */
    public List<Object> excuteQuery(String sql, Object[] params) {
        // 获取结果
        ResultSet rs = executeQueryRS(sql, params);
        ResultSetMetaData rsmd = null;
        int columnCount = 0;
        try {
            rsmd = rs.getMetaData();
            columnCount = rsmd.getColumnCount();
        } catch (SQLException e1) {
            System.out.println(e1.getMessage());
        }

        List<Object> list = new ArrayList<Object>();

        try {
            while (rs.next()) {
                Map<String, Object> map = new HashMap<String, Object>();
                for (int i = 1; i <= columnCount; i++) {
                    map.put(rsmd.getColumnLabel(i), rs.getObject(i));
                }
                list.add(map);
            }
        } catch (SQLException e) {
            LOG.error("查询结果集,将转list出错：" + e);
        }

        return list;
    }

    /**
     * 查询结果集
     * 
     * @param sql
     * @param params
     * @return
     */
    private ResultSet executeQueryRS(String sql, Object[] params) {
        try {
            pstm = connection.prepareStatement(sql);
            if (null != params) {
                for (int i = 0; i < params.length; i++) {
                    pstm.setObject(i + 1, params[i]);
                }
            }
            resultSet = pstm.executeQuery();
        } catch (SQLException e) {
            LOG.error("查询结果集出错：" + e);
        }

        return resultSet;
    }

    /**
     * 关闭方法
     */
    public void closeAll() {

        if (resultSet != null) {
            try {
                resultSet.close();
            } catch (SQLException e) {
                LOG.error("resultSet关闭失败:" + e.getMessage());
            }
        }
        if (pstm != null) {
            try {
                pstm.close();
            } catch (SQLException e) {
                LOG.error("pstm关闭失败:" + e.getMessage());
            }
        }
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                LOG.error("connection关闭失败:" + e.getMessage());
            }
        }
    }

    /**
     * 获取ADS 的jdbc链接
     */
    public static JdbcUtils getAdsJdbc() {

        String url = "jdbc:mysql://" + ConfigReader.getProperty("ads", "ads.ip") + ":"
                + ConfigReader.getProperty("ads", "ads.port") + "/" + ConfigReader.getProperty("ads", "ads.dbname")
                + "?useUnicode=true&characterEncoding=UTF-8";
        String userName = ConfigReader.getProperty("ads", "ads.username");
        String password = ConfigReader.getProperty("ads", "ads.userpwd");

        return new JdbcUtils(ConstantUtil.ADS_DRIVER_NAME, url, userName, password);
    }

    /**
     * 获取ODPS的jdbc链接
     * 
     * @return
     */
    @Deprecated
    public static JdbcUtils getOdpsJdbc() {

        String url = "jdbc:odps:" + ConfigReader.getProperty("odps", "endpoint") + "?project="
                + ConfigReader.getProperty("odps", "project.name") + "&charset=UTF-8";
        String username = ConfigReader.getProperty("odps", "access.id");
        String password = ConfigReader.getProperty("odps", "access.key");

        return new JdbcUtils(ConstantUtil.ODPS_DRIVER_NAME, url, username, password);
    }

    /**
     * 获取GreenPlum的jdbc连接
     * 
     * @return
     */
    public static JdbcUtils getGpJdbc() {

        String ip = ConfigReader.getProperty("gp", "gp.ip");
        String port = ConfigReader.getProperty("gp", "gp.port");
        String dbname = ConfigReader.getProperty("gp", "gp.dbname");

        String url = "jdbc:pivotal:greenplum://" + ip + ":" + port + ";DatabaseName=" + dbname;

        String username = ConfigReader.getProperty("gp", "gp.username");
        String password = ConfigReader.getProperty("gp", "gp.userpwd");

        return new JdbcUtils(ConstantUtil.GP_DRIVER_NAME, url, username, password);

    }
    
    /**
     * 获取RDS的jdbc连接
     * 
     * @return
     */
    public static JdbcUtils getRDSJdbc() {


    	String ip = ConfigReader.getProperty("db", "db.ip");
        String port = ConfigReader.getProperty("db", "db.port");
        String dbname = ConfigReader.getProperty("db", "db.dbname");

        String url = "jdbc:mysql://" + ip + ":"+ port + "/" + dbname;
        String username = ConfigReader.getProperty("db", "db.username");
        String password = ConfigReader.getProperty("db", "db.userpwd");

        return new JdbcUtils(ConstantUtil.ADS_DRIVER_NAME, url, username, password);

    }


}
