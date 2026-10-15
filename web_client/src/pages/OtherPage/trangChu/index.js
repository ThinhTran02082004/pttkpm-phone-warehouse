import { Button, Card, Row, Col } from 'react-bootstrap'

import Page1 from '../../../components/layouts/Page1'
import SideNavbar from '../../../components/layouts/sideBar'
import { Icons } from '../../../components/Icons'

const colors = {
  primary: '#1a56db',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  dark: '#111827',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626'
}

const features = [
  {
    icon: Icons.Smartphone,
    title: 'Quản lý Sản phẩm',
    desc: 'Theo dõi chi tiết sản phẩm, cấu hình và giá cả',
    link: '/san-pham',
    color: colors.primary
  },
  {
    icon: Icons.Warehouse,
    title: 'Nhập/Xuất kho',
    desc: 'Quản lý nhập xuất hàng hóa theo IMEI',
    link: '/nhap-kho',
    color: colors.success
  },
  {
    icon: Icons.BarChart,
    title: 'Thống kê Báo cáo',
    desc: 'Xem doanh thu, lợi nhuận theo thời gian',
    link: '/thong-ke',
    color: colors.danger
  },
  {
    icon: Icons.Users,
    title: 'Đối tác',
    desc: 'Quản lý khách hàng và nhà cung cấp',
    link: '/khach-hang',
    color: colors.warning
  }
]

function TrangChu() {
  return (
    <Page1 sidebar={<SideNavbar />}>
      <div style={{
        height: '100%',
        background: colors.grayLight,
        overflow: 'auto',
        padding: '2rem'
      }}>

        {/* Hero Section */}
        <Card style={{
          border: 'none',
          borderRadius: 16,
          background: '#fff',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Card.Body style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              background: `${colors.primary}15`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: colors.primary
            }}>
              <span style={{ transform: 'scale(2)' }}><Icons.Smartphone /></span>
            </div>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: colors.dark,
              marginBottom: '0.75rem'
            }}>
              Hệ thống Quản lý Kho Điện thoại
            </h1>
            <p style={{
              color: colors.gray,
              fontSize: '1.1rem',
              maxWidth: 500,
              margin: '0 auto 1.5rem'
            }}>
              Quản lý sản phẩm điện thoại theo mã IMEI một cách chính xác, dễ dàng và hiệu quả
            </p>
            <Button
              href="/san-pham"
              style={{
                padding: '0.75rem 2rem',
                background: colors.primary,
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              Bắt đầu ngay
              <Icons.ArrowRight />
            </Button>
          </Card.Body>
        </Card>

        {/* Features Section */}
        <h4 style={{
          fontWeight: 600,
          color: colors.dark,
          marginBottom: '1rem',
          paddingLeft: 4
        }}>
          Tính năng chính
        </h4>
        <Row className="g-3 mb-4">
          {features.map((feature, i) => (
            <Col key={i} xs={12} md={6} lg={3}>
              <Card
                style={{
                  border: 'none',
                  borderRadius: 12,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                onClick={() => window.location.href = feature.link}
              >
                <Card.Body style={{ padding: '1.5rem' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    background: `${feature.color}15`,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    color: feature.color
                  }}>
                    <feature.icon />
                  </div>
                  <h6 style={{ fontWeight: 600, color: colors.dark, marginBottom: '0.5rem' }}>
                    {feature.title}
                  </h6>
                  <p style={{ color: colors.gray, fontSize: '0.875rem', marginBottom: 0 }}>
                    {feature.desc}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Stats */}
        <Row className="g-3">
          <Col xs={12} md={4}>
            <Card style={{ border: 'none', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Card.Body style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: `${colors.primary}15`,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.primary
                }}>
                  <Icons.Package />
                </div>
                <div>
                  <p style={{ margin: 0, color: colors.gray, fontSize: '0.875rem' }}>Tổng sản phẩm</p>
                  <h4 style={{ margin: 0, fontWeight: 700, color: colors.dark }}>1,234</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card style={{ border: 'none', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Card.Body style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: `${colors.success}15`,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.success
                }}>
                  <Icons.Users />
                </div>
                <div>
                  <p style={{ margin: 0, color: colors.gray, fontSize: '0.875rem' }}>Khách hàng</p>
                  <h4 style={{ margin: 0, fontWeight: 700, color: colors.dark }}>567</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card style={{ border: 'none', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Card.Body style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: `${colors.warning}15`,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.warning
                }}>
                  <Icons.BarChart />
                </div>
                <div>
                  <p style={{ margin: 0, color: colors.gray, fontSize: '0.875rem' }}>Doanh thu tháng</p>
                  <h4 style={{ margin: 0, fontWeight: 700, color: colors.dark }}>₫890M</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb',
          color: colors.gray,
          fontSize: '0.875rem'
        }}>
          © 2026 Phone Manager. All rights reserved.
        </div>
      </div>
    </Page1>
  )
}

export default TrangChu