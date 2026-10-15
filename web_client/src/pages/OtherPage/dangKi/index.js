import { useState } from 'react';
import { Button, Form, FormGroup, FormLabel, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import InputShadow from '../../../components/Forms/InputShadow';
import { registerAccount } from "../../../api/authentication";
import { Icons } from '../../../components/Icons';

const colors = {
  primary: '#1a56db',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  dark: '#111827',
  success: '#059669',
  danger: '#dc2626'
}

function DangKi() {
  const [formData, setFormData] = useState({ hoten: "", mail: "", password: "", password2: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.hoten || !formData.mail || !formData.password || !formData.password2) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.password2) {
      setError("Mật khẩu không khớp");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      const result = await registerAccount({
        hoten: formData.hoten,
        mail: formData.mail,
        password: formData.password
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/dang-nhap";
        }, 2000);
      } else {
        setError(result.message || "Đăng ký thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.grayLight,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40,
            height: 40,
            background: colors.primary,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Icons.Smartphone />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.dark }}>
            Phone Manager
          </span>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <Card style={{
          maxWidth: 440,
          width: '100%',
          border: 'none',
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)'
        }}>
          <Card.Body style={{ padding: '2.5rem' }}>
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: 64,
                height: 64,
                background: `${colors.primary}15`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: colors.primary
              }}>
                <span style={{ transform: 'scale(1.5)' }}><Icons.UserPlus /></span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.dark, marginBottom: '0.5rem' }}>
                Tạo tài khoản
              </h2>
              <p style={{ color: colors.gray, margin: 0 }}>
                Đăng ký để sử dụng hệ thống
              </p>
            </div>

            {/* Alerts */}
            {success && (
              <Alert variant="success" style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.CheckCircle />
                Đăng ký thành công! Đang chuyển hướng...
              </Alert>
            )}

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}
                style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.AlertCircle />
                {error}
              </Alert>
            )}

            {/* Form */}
            <Form onSubmit={onSubmit}>
              <FormGroup style={{ marginBottom: '1rem' }}>
                <FormLabel style={{ fontWeight: 500, color: colors.dark, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: colors.primary }}><Icons.User /></span>
                  Họ và tên
                </FormLabel>
                <InputShadow
                  placeholder="Nguyễn Văn A"
                  type="text"
                  value={formData.hoten}
                  onChange={e => setFormData(src => ({ ...src, hoten: e.target.value }))}
                  disabled={loading || success}
                  required
                  style={{ padding: '0.75rem 1rem', borderRadius: 8 }}
                />
              </FormGroup>

              <FormGroup style={{ marginBottom: '1rem' }}>
                <FormLabel style={{ fontWeight: 500, color: colors.dark, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: colors.primary }}><Icons.Mail /></span>
                  Email
                </FormLabel>
                <InputShadow
                  placeholder="email@example.com"
                  type="email"
                  value={formData.mail}
                  onChange={e => setFormData(src => ({ ...src, mail: e.target.value }))}
                  disabled={loading || success}
                  required
                  style={{ padding: '0.75rem 1rem', borderRadius: 8 }}
                />
              </FormGroup>

              <FormGroup style={{ marginBottom: '1rem' }}>
                <FormLabel style={{ fontWeight: 500, color: colors.dark, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: colors.primary }}><Icons.Lock /></span>
                  Mật khẩu
                </FormLabel>
                <InputShadow
                  placeholder="Ít nhất 6 ký tự"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(src => ({ ...src, password: e.target.value }))}
                  disabled={loading || success}
                  required
                  style={{ padding: '0.75rem 1rem', borderRadius: 8 }}
                />
              </FormGroup>

              <FormGroup style={{ marginBottom: '1.5rem' }}>
                <FormLabel style={{ fontWeight: 500, color: colors.dark, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: colors.primary }}><Icons.Lock /></span>
                  Xác nhận mật khẩu
                </FormLabel>
                <InputShadow
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                  value={formData.password2}
                  onChange={e => setFormData(src => ({ ...src, password2: e.target.value }))}
                  disabled={loading || success}
                  required
                  style={{ padding: '0.75rem 1rem', borderRadius: 8 }}
                />
                {formData.password2 && formData.password !== formData.password2 && (
                  <small style={{ color: colors.danger, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Icons.AlertCircle /> Mật khẩu không khớp
                  </small>
                )}
                {formData.password2 && formData.password === formData.password2 && formData.password2.length >= 6 && (
                  <small style={{ color: colors.success, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Icons.CheckCircle /> Mật khẩu khớp
                  </small>
                )}
              </FormGroup>

              <Button
                type="submit"
                disabled={loading || success}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: colors.primary,
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Icons.UserPlus />
                    Đăng ký
                  </>
                )}
              </Button>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', color: colors.gray, marginBottom: 0 }}>
                Đã có tài khoản?{' '}
                <Link to="/dang-nhap" style={{ color: colors.primary, textDecoration: 'none', fontWeight: 600 }}>
                  Đăng nhập ngay
                </Link>
              </p>
            </Form>
          </Card.Body>
        </Card>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        color: colors.gray,
        fontSize: '0.875rem'
      }}>
        © 2026 Phone Manager. All rights reserved.
      </footer>
    </div>
  )
}

export default DangKi;