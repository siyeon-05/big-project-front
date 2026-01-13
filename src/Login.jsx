export default function LoginApp() {
  return (
    <div className="login-page navy">
      <div className="login-shell split">
        <section className="login-hero navy-panel">
          <div className="hero-top">
            <span className="hero-title-line">BrandPliot</span>
          </div>
          <p className="hero-copy subtle">
            가장 완벽한 분석으로
            <br />
            귀하의 비즈니스 가치를
            <br />
            증명하세요.
          </p>
        </section>

        <section className="login-panel light-panel">
          <h2>LOGIN</h2>
          <form className="login-form">
            <div className="field">
              <label htmlFor="login-email">ID(E-mail)</label>
              <input
                id="login-email"
                type="email"
                placeholder="ID (E-mail) 입력"
              />
            </div>
            <div className="field">
              <label htmlFor="login-password">비밀번호</label>
              <div className="input-with-icon">
                <input
                  id="login-password"
                  type="password"
                  placeholder="비밀번호 입력"
                />
              </div>
            </div>
            <button type="submit" className="login-primary full">
              로그인
            </button>
            <p className="signup-inline">
              저희와 함께 하시겠습니까? <button type="button">회원가입</button>
              <br></br>
              ID/비밀번호를 찾으시겠습니까? <button type="button">ID/비밀번호 찾기</button> 
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
