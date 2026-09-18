<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
  <#if section = "form">
    <div class="kc-login-theme-branding">
      <div class="kc-logo-text">
        <span class="kc-logo-main">CacheSol</span>
        <span class="kc-logo-sub">Enterprise Platform</span>
      </div>
    </div>

    <#if realm.internationalizationEnabled>
      <div class="kc-locale-wrapper">
        <div class="kc-dropdown" id="kc-locale">
          <div id="kc-locale-wrapper">
            <div id="kc-locale-dropdown">
              <a href="#" id="kc-current-locale-link">${locale.currentLanguageTag}</a>
            </div>
            <ul id="kc-locale-dropdown-menu" class="kc-dropdown-menu">
              <#list locale.supported as l>
                <li>
                  <a href="${l.url}" class="${l.label == locale.currentLanguageTag?then("kc-active", "")}">${l.label}</a>
                </li>
              </#list>
            </ul>
          </div>
        </div>
      </div>
    </#if>

    <form id="kc-form-login" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
      <div class="${properties.kcFormGroupClass!}">
        <div class="${properties.kcLabelWrapperClass!}">
          <label for="username" class="${properties.kcLabelClass!}">
            <#if !realm.loginWithEmailAllowed>${msg("username")}
            <#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}
            <#else>${msg("email")}
            </#if>
          </label>
        </div>
        <div class="${properties.kcInputWrapperClass!}">
          <input
            tabindex="1"
            id="username"
            class="${properties.kcInputClass!}"
            name="username"
            type="text"
            autofocus
            autocomplete="username"
            value="${(login.username!'')}"
            aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"
          />
          <#if messagesPerField.existsError('username')>
            <span id="input-error-username" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
              ${kcSanitize(messagesPerField.getFirstError('username'))}
            </span>
          </#if>
        </div>
      </div>

      <div class="${properties.kcFormGroupClass!}">
        <div class="${properties.kcLabelWrapperClass!}">
          <label for="password" class="${properties.kcLabelClass!}">${msg("password")}</label>
        </div>
        <div class="${properties.kcInputWrapperClass!}">
          <input
            tabindex="2"
            id="password"
            class="${properties.kcInputClass!}"
            name="password"
            type="password"
            autocomplete="current-password"
            aria-invalid="<#if messagesPerField.existsError('password')>true</#if>"
          />
          <#if messagesPerField.existsError('password')>
            <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
              ${kcSanitize(messagesPerField.getFirstError('password'))}
            </span>
          </#if>
        </div>
      </div>

      <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingOffsetClass!}">
        <div id="kc-form-options">
          <#if realm.rememberMe && !realm.loginWithEmailAllowed>
            <div class="${properties.kcCheckboxWrapperClass!}">
              <label for="rememberMe" class="${properties.kcLabelClass!}">
                <input
                  tabindex="3"
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  <#if login.rememberMe??>checked</#if>
                />
                ${msg("rememberMe")}
              </label>
            </div>
          </#if>
        </div>
        <div class="${properties.kcFormOptionsWrapperClass!}">
          <#if realm.resetPasswordAllowed>
            <span>
              <a tabindex="5" href="${url.loginResetCredentialsUrl}">
                ${msg("doForgotPassword")}
              </a>
            </span>
          </#if>
        </div>
      </div>

      <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
        <input
          tabindex="4"
          class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
          name="login"
          id="kc-login"
          type="submit"
          value="${msg("doLogIn")}"
        />
      </div>
    </form>

    <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
      <div id="kc-registration">
        <span>${msg("noAccount")} <a tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
      </div>
    </#if>

  <#elseif section = "info">
    <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
      <div id="kc-info-wrapper">
        <div id="kc-registration-container">
          <div id="kc-registration">
            <span>${msg("noAccount")} <a tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
          </div>
        </div>
      </div>
    </#if>
  </#if>
</@layout.registrationLayout>
