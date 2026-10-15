import { useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Icons } from '../../../components/Icons';

const colors = {
  primary: '#1a56db',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  dark: '#111827',
  success: '#059669'
}

function DangSuat() {
  useEffect(function () {
    sessionStorage.removeItem("Authorization")
    sessionStorage.removeItem("user")
  }, [])

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
          <Card.Body style={{ padding: '3rem', textAlign: 'center' }}>
            {/* Success Icon */}
            <div style={{
              width: 80,
              height: 80,
              background: `${colors.success}15`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: colors.success
            }}>
              <span style={{ transform: 'scale(2)' }}><Icons.CheckCircle /></span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.dark, marginBottom: '0.5rem' }}>
              Đăng xuất thành công
            </h2>
            <p style={{ color: colors.gray, marginBottom: '2rem' }}>
              Cảm ơn bạn đã sử dụng hệ thống.<br />
              Hẹn gặp lại!
            </p>

            <Button
              href="/dang-nhap"
              style={{
                padding: '0.875rem 2rem',
                background: colors.primary,
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Icons.Login />
              Đăng nhập lại
            </Button>

            <div style={{ marginTop: '1.5rem' }}>
              <a href="/" style={{ color: colors.gray, textDecoration: 'none', fontSize: '0.875rem' }}>
                ← Về trang chủ
              </a>
            </div>
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

export default DangSuat;