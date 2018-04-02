/**
 * Created on 2017-8-16 上午11:29:36 <br>
 */
package com.ascf.di.web.web;

import com.aliyun.odps.utils.StringUtils;
import com.ascf.di.common.util.ConfigReader;
import com.ascf.di.web.sso.dto.CertQueryResult;
import com.ascf.di.web.sso.service.SsoPkiService;

import org.springframework.util.CollectionUtils;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import java.io.ByteArrayInputStream;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 用户登录拦截器 .<br>
 * 此拦截器有两个用途，一是单点登录识别并完成票据验证及证书获取<br>
 * 本系统PKI登录，即进入
 * 
 * @author wangzejun <br>
 */
public class LoginHandlerInterceptor extends HandlerInterceptorAdapter {

    /**
     * 不需要做登录拦截的url，比如自定义的登录请求url，对外开放的接口url等
     */
    private List<String> notInterceptUrlList;

    /**
     * 系统默认的登录请求url
     */
    private String defaultLoginUrl = "/loginManage.do";

    @Resource
    private SsoPkiService ssoPkiService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String url = request.getRequestURL().toString();
        String ticket = request.getParameter("ticket");
        X509Certificate userCert = null;
        boolean isDevelop = ConfigReader.getBoolean("pki", "devMode");
        boolean hasCert = ConfigReader.getBoolean("pki", "hasCert");
        if (isDevelop && !hasCert || hasCert) {
            allowInterviewSetting(response);
            return true;
        }
        // 注意！如果链接带了ticket参数，要求这个链接是走SSL单向认证，不然发送此请求时会弹出选择证书
        if (StringUtils.isNotBlank(ticket)) {
            allowInterviewSetting(response);
            CertQueryResult cr = ssoPkiService.executeWsByTicket(ticket);
            if (CertQueryResult.ResultCode.SUCCESS.getCode().equals(cr.getCode())) {
                String certStr = cr.getCert();
                ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(
                        jit.util.encoders.Base64.decode(certStr));
                CertificateFactory cf = CertificateFactory.getInstance("X.509");
                userCert = (X509Certificate) cf.generateCertificate(byteArrayInputStream);
            } else {
                response.getWriter().println("<script>alert('" + cr.getMessage() + "')</script>");
                return false;
            }
        }

        if (userCert != null) {
            // 门户系统单点登录 登录请求拦截
            if (StringUtils.isNotBlank(ticket) && url.contains(defaultLoginUrl)) {
                request.getSession().setAttribute("cert", userCert);
                return true;
            }

            // 其他系统接口调用本系统需要校验中间件
            if (isDevelop || ssoPkiService.authenticate(userCert)) {
                return true;
            } else {
                return false;
            }

        }

        // 登录操作则通过拦截（当前系统）
        if (url.contains(defaultLoginUrl)) {
            return true;
        }

        // 如果url是不需要拦截的，则通过拦截
        if (!CollectionUtils.isEmpty(notInterceptUrlList)) {
            for (String str : notInterceptUrlList) {
                if (url.contains(str)) {
                    return true;
                }
            }
        }
        Object object = request.getSession().getAttribute("cert");

        // 证书还存在则通过拦截
        if (object != null) {
            return true;
        }
        // 其它情况则拦截访问 返回419 让前端处理
        response.setStatus(419);
        return false;
    }

    /**
     * 允许其他系统通过ticket来查询系统（跨域设置）
     * 
     * @param response
     */
    private void allowInterviewSetting(HttpServletResponse response) {
        response.setContentType("text/html;charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "0");
        response.setHeader("Access-Control-Allow-Headers",
                "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With,userId,token");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("XDomainRequestAllowed", "1");
    }

    public List<String> getNotInterceptUrlList() {
        return notInterceptUrlList;
    }

    public void setNotInterceptUrlList(List<String> notInterceptUrlList) {
        this.notInterceptUrlList = notInterceptUrlList;
    }
}
