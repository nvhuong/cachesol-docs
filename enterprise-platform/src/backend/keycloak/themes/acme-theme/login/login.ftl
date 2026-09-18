<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
  <#if section = "form">
    <div class="acme-login-hero">
      <div class="acme-hero-content">
        <div class="acme-logo-area">
          <svg class="acme-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#2563EB"/>
            <path d="M24 8L38 38H10L24 8Z" fill="white"/>
            <circle cx="24" cy="28" r="4" fill="#2563EB"/>
          </svg>
          <div class="acme-logo-text">
            <span class="acme-company">ACME Corporation</span>
            <span class="acme-tagline">Enterprise Portal</span>
          </div>
        </div>
        <p class="acme-hero-desc">Sign in to access your workspace</p>
      </div>
    </div>

    <#if realm.internationalizationEnabled>
      <div class="acme-locale-bar">
        <div class="acme-dropdown" id="kc-locale">
          <div id="kc-locale-wrapper">
            <div id="kc-locale-dropdown">
              <a href="#" id="kc-current-locale-link">${locale.currentLanguageTag}</a>
            </div>
            <ul id="kc-locale-dropdown-menu" class="acme-dropdown-menu">
              <#list locale.supported as l>
                <li>
                  <a href="${l.url}" class="${l.label == locale.currentLanguageTag?then("acme-active", "")}">${l.label}</a>
                </li>
              </#list>
            </ul>
          </div>
        </div>
      </div>
    </#if>

    <form id="kc-form-login" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
      <div class="${properties.kcFormGroupClass!}">
        <label for="username" class="${properties.kcLabelClass!}">
          <#if !realm.loginWithEmailAllowed>Username
          <#elseif !realm.registrationEmailAsUsername>Username or Email
          <#else>Email
          </#if>
        </label>
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
            placeholder="Enter your username or email"
          />
          <#if messagesPerField.existsError('username')>
            <span id="input-error-username" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
              ${kcSanitize(messagesPerField.getFirstError('username'))}
            </span>
          </#if>
        </div>
      </div>

      <div class="${properties.kcFormGroupClass!}">
        <div class="acme-label-row">
          <label for="password" class="${properties.kcLabelClass!}">Password</label>
          <#if realm.resetPasswordAllowed>
            <a tabindex="5" href="${url.loginResetCredentialsUrl}" class="acme-forgot-link">
              Forgot password?
            </a>
          </#if>
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
            placeholder="Enter your password"
          />
          <#if messagesPerField.existsError('password')>
            <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
              ${kcSanitize(messagesPerField.getFirstError('password'))}
            </span>
          </#if>
        </div>
      </div>

      <div class="${properties.kcFormGroupClass!} acme-options-row">
        <#if realm.rememberMe && !realm.loginWithEmailAllowed>
          <label for="rememberMe" class="acme-checkbox-label">
            <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox"
              <#if login.rememberMe??>checked</#if> />
            <span>Remember me</span>
          </label>
        <#else>
          <span></span>
        </#if>
      </div>

      <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
        <input
          tabindex="4"
          class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
          name="login"
          id="kc-login"
          type="submit"
          value="Sign In"
        />
      </div>
    </form>

    <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
      <div id="kc-registration" class="acme-register-row">
        <span>New to ACME? </span>
        <a tabindex="6" href="${url.registrationUrl}">Create an account</a>
      </div>
    </#if>

  <#elseif section = "info">
    <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
      <div id="kc-info-wrapper">
        <div id="kc-registration-container">
          <div id="kc-registration">
            New to ACME? <a tabindex="6" href="${url.registrationUrl}">Create an account</a>
          </div>
        </div>
      </div>
    </#if>
  </#if>
</@layout.registrationLayout>
