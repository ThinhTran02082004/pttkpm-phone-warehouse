import { useState } from 'react';
import { Alert, Button, Card, Form, FormGroup, FormLabel } from 'react-bootstrap';

import InputShadow from '../../../components/Forms/InputShadow';
import { loginAccount } from "../../../api/authentication";
import { Icons } from '../../../components/Icons';

// Color scheme
const colors = {
  primary: '#1a56db',
  primaryDark: '#1e40af',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  dark: '#111827'
}

function DangNhap() {
  const [formData, setFormData] = useState({ mail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await loginAccount(formData)

      if (result.success && result.user) {
        sessionStorage.setItem("Authorization", result.token)
        sessionStorage.setItem("user", JSON.stringify(result.user))
        window.location.href = "/"
      } else {
        setError(result.message || "Email hoặc mật khẩu không đúng!")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setLoading(false)
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
          maxWidth: 420,
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
                <span style={{ transform: 'scale(1.5)' }}><Icons.Lock /></span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.dark, marginBottom: '0.5rem' }}>
                Đăng nhập
              </h2>
              <p style={{ color: colors.gray, margin: 0 }}>
                Nhập thông tin để truy cập hệ thống
              </p>
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}
                style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.AlertCircle />
                {error}
              </Alert>
            )}

            <Form onSubmit={onSubmit}>
              <FormGroup style={{ marginBottom: '1.25rem' }}>
                <FormLabel style={{ fontWeight: 500, color: colors.dark, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: colors.primary }}><Icons.Mail /></span>
                  Email
                </FormLabel>
                <InputShadow
                  placeholder="your@email.com"
                  type="email"
                  required
                  value={formData.mail}
                  onChange={e => setFormData(src => ({ ...src, mail: e.target.value }))}
                  style={{ padding: '0.75rem 1rem', borderRadius: 8 }}
                />
              </FormGroup>

              <FormGroup style={{ marginBottom: '1.25rem' }}>
                <FormLabel style={{ fontWeight: 500, color: colors.dark, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: colors.primary }}><Icons.Lock /></span>
                  Mật khẩu
                </FormLabel>
                <InputShadow
                  placeholder="••••••••"
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData(src => ({ ...src, password: e.target.value }))}
                  style={{ padding: '0.75rem 1rem', borderRadius: 8 }}
                />
              </FormGroup>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Form.Check
                  type="checkbox"
                  label="Ghi nhớ"
                  style={{ color: colors.gray }}
                />
                <a href="#" style={{ color: colors.primary, textDecoration: 'none', fontSize: '0.875rem' }}>
                  Quên mật khẩu?
                </a>
              </div>

              <Button
                type='submit'
                disabled={loading}
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
                    <Icons.Login />
                    Đăng nhập
                  </>
                )}
              </Button>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', color: colors.gray, marginBottom: 0 }}>
                Chưa có tài khoản?{' '}
                <a href="/dang-ki" style={{ color: colors.primary, textDecoration: 'none', fontWeight: 600 }}>
                  Đăng ký ngay
                </a>
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

export default DangNhap;