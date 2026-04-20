import { useState } from "react";
import { useAuth } from "../context/AuthContext.js";

export default function Register({ setCurrentPage }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Nama lengkap harus diisi";
    if (!form.email.includes("@")) return "Email tidak valid";
    if (!form.phone.match(/^08\d{8,12}$/)) return "Nomor telepon tidak valid";
    if (form.password.length < 8) return "Password minimal 8 karakter";
    if (form.password !== form.confirm)
      return "Konfirmasi password tidak cocok";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      setCurrentPage("home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
      </div>

      <div className="auth-container auth-container-wide">
        <div className="auth-logo" onClick={() => setCurrentPage("home")}>
          <img
            src="/alobidan.png"
            alt="AloBidan"
            className="logo-img"
            style={{ height: "40px", objectFit: "contain" }}
          />
          <span className="logo-text">
            Alo<span className="logo-accent">Bidan</span>
          </span>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">Buat Akun Baru</h1>
            <p className="auth-subtitle">
              Bergabung dengan 1.000+ Bunda AloBidan
            </p>
          </div>

          <div className="register-benefits">
            <div className="benefit-item">Konsultasi Bidan via WA</div>
            <div className="benefit-item">Booking layanan mudah & cepat</div>
            <div className="benefit-item">Riwayat kunjungan tercatat rapi</div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="auth-form"
            id="register-form"
          >
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">
                  Nama Lengkap
                </label>
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    className="auth-input"
                    placeholder="Nama lengkap Anda"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">
                  No. Telepon
                </label>
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    className="auth-input"
                    placeholder="08xxxxxxxxxx"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">
                Email
              </label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  className="auth-input"
                  placeholder="email@contoh.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Password
                </label>
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    id="reg-password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    className="auth-input"
                    placeholder="Min. 8 karakter"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="show-pass-btn"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "Sembunyi" : "Lihat"}
                  </button>
                </div>
                {form.password && (
                  <div className="password-strength">
                    <div
                      className={`strength-bar ${form.password.length >= 8 ? "strong" : form.password.length >= 5 ? "medium" : "weak"}`}
                    >
                      <div className="strength-fill"></div>
                    </div>
                    <span>
                      {form.password.length >= 8
                        ? "Kuat"
                        : form.password.length >= 5
                          ? "Sedang"
                          : "Lemah"}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">
                  Konfirmasi Password
                </label>
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    id="reg-confirm"
                    name="confirm"
                    type={showPass ? "text" : "password"}
                    className="auth-input"
                    placeholder="Ulangi password"
                    value={form.confirm}
                    onChange={handleChange}
                    required
                  />
                </div>
                {form.confirm && (
                  <p
                    className={`confirm-match ${form.password === form.confirm ? "match" : "no-match"}`}
                  >
                    {form.password === form.confirm
                      ? "Password cocok"
                      : "Password tidak cocok"}
                  </p>
                )}
              </div>
            </div>

            <label className="terms-check">
              <input type="checkbox" id="terms-check" required />
              <span>
                Saya menyetujui{" "}
                <button type="button" className="auth-link">
                  Syarat & Ketentuan
                </button>{" "}
                dan{" "}
                <button type="button" className="auth-link">
                  Kebijakan Privasi
                </button>{" "}
                AloBidan
              </span>
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
              id="register-submit"
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <p className="auth-switch">
            Sudah punya akun?{" "}
            <button
              className="auth-link"
              onClick={() => setCurrentPage("login")}
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
