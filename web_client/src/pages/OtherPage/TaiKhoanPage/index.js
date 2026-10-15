import { useState, useEffect, useContext } from 'react'
import { Image, Form, FormGroup, FormLabel, FormControl, FormSelect, Button } from 'react-bootstrap'

import ContentA from '../../../components/layouts/blockContent'
import Page1 from '../../../components/layouts/Page1'
import SideNavbar from '../../../components/layouts/sideBar'
import InputShadow from '../../../components/Forms/InputShadow'
import { UserContext } from '../../../api/authentication'

import styles from './style.module.css'

const API_URL = 'http://localhost:3002'

function TaiKhoan() {
  const auth = useContext(UserContext)

  // Form state
  const [hoten, setHoten] = useState('')
  const [gioitinh, setGioitinh] = useState('Nam')
  const [ngaysinh, setNgaysinh] = useState('')
  const [cccd, setCccd] = useState('')
  const [email, setEmail] = useState('')
  const [sodienthoai, setSodienthoai] = useState('')
  const [manhanvien, setManhanvien] = useState('')
  const [vitri, setVitri] = useState('')
  const [tinh, setTinh] = useState('')
  const [quan, setQuan] = useState('')
  const [phuong, setPhuong] = useState('')
  const [diachi, setDiachi] = useState('')
  const [avatar, setAvatar] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch profile from API
  useEffect(() => {
    if (auth?.user?.manhanvien) {
      fetchProfile(auth.user.manhanvien)
    }
  }, [auth])

  async function fetchProfile(id) {
    try {
      const res = await fetch(`${API_URL}/api/auth/profile/${id}`)
      const data = await res.json()
      if (data.success && data.Data) {
        const user = data.Data
        setHoten(user.hoten || '')
        setGioitinh(user.gioitinh || 'Nam')
        setNgaysinh(user.ngaysinh ? new Date(user.ngaysinh).toISOString().split('T')[0] : '')
        setEmail(user.mail || '')
        setSodienthoai(user.sodienthoai || '')
        setManhanvien(user.manhanvien || '')
        setVitri(user.tennhomquyen || user.tenhienthi || '')
        setCccd(user.cccd || '')
        setAvatar(user.avatar || '')
        setTinh(user.tinh || '')
        setQuan(user.quan || '')
        setPhuong(user.phuong || '')
        setDiachi(user.diachi || '')
      }
    } catch (e) {
      console.error('Error fetching profile:', e)
    }
  }

  async function handleSave() {
    if (!manhanvien) return setMessage('Không tìm thấy mã nhân viên')

    setLoading(true)
    setMessage('')

    try {
      let fetchBody;
      let headers = {};

      if (avatarFile) {
        // If there's a file, we MUST use FormData
        const formData = new FormData();
        formData.append('hoten', hoten);
        formData.append('gioitinh', gioitinh);
        if (ngaysinh) formData.append('ngaysinh', ngaysinh);
        formData.append('sodienthoai', sodienthoai);
        formData.append('cccd', cccd);
        formData.append('tinh', tinh);
        formData.append('quan', quan);
        formData.append('phuong', phuong);
        formData.append('diachi', diachi);

        // Append the file
        formData.append('avatarFile', avatarFile);

        // We do NOT set Content-Type header when using FormData with fetch
        // The browser will automatically set it to multipart/form-data with the correct boundary
        fetchBody = formData;
      } else {
        // Otherwise use JSON
        headers = { 'Content-Type': 'application/json' };
        fetchBody = JSON.stringify({
          hoten,
          gioitinh,
          ngaysinh: ngaysinh || null,
          sodienthoai,
          cccd,
          avatar,
          tinh,
          quan,
          phuong,
          diachi
        });
      }

      const res = await fetch(`${API_URL}/api/auth/profile/${manhanvien}`, {
        method: 'PUT',
        headers,
        body: fetchBody
      })

      const data = await res.json()
      if (data.success) {
        setMessage('✓ Lưu thành công!')

        // Update user session storage
        // If a file was uploaded, we want to fetch the updated profile to get the real server URL
        if (avatarFile) {
          await fetchProfile(manhanvien);
          setAvatarFile(null); // Clear the file selection after successful upload
        }

        const userStr = sessionStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          sessionStorage.setItem('user', JSON.stringify({
            ...user,
            hoten, gioitinh, ngaysinh, sodienthoai, cccd,
            avatar: data.avatar || user.avatar || avatar,
            tinh, quan, phuong, diachi
          }))

          // Dispatch a custom event to notify other components (like SideNavbar) 
          // that the avatar might have changed
          window.dispatchEvent(new Event('avatarUpdated'))
        }
      } else {
        setMessage('✗ ' + (data.message || 'Lỗi lưu'))
      }
    } catch (e) {
      setMessage('✗ Lỗi kết nối: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatar(URL.createObjectURL(file))
    }
  }

  return (
    <Page1 sidebar={<SideNavbar />}>
      <div className='d-flex p-3 gap-3 flex-column w-100 h-100 _bg-blue-0'>
        <div className='_bg-blue w-auto p-2 mx-auto text-center text-light px-5 rounded-3 shadow-sm'>
          <h2 className='m-0'>
            Tài khoản
          </h2>
        </div>

        <div className="d-flex gap-0 gap-3 vh-100">
          <ContentA as={Form} className="w-25 h-100 d-flex flex-column p-3 gap-4">
            <FormGroup className='h-50 d-flex flex-column gap-2'>
              <Image src={avatar || '/default-avatar.png'} className='h-100 w-100 bg-dark border border-dark border-3' style={{ objectFit: 'cover' }} />
              <InputShadow type="file" accept="image/*" onChange={handleAvatarChange} />
            </FormGroup>

            <FormGroup className='d-flex gap-1 align-items-center'>
              <FormLabel className='fw-bold w-100'>Mã nhân viên</FormLabel>
              <InputShadow disabled value={manhanvien} />
            </FormGroup>

            <FormGroup className='d-flex gap-1 align-items-center'>
              <FormLabel className='fw-bold w-100'>Vị trí</FormLabel>
              <InputShadow disabled value={vitri} />
            </FormGroup>
          </ContentA>

          <ContentA as={Form} className="d-flex flex-column justify-content-between p-3 w-75">

            <FormGroup className='d-flex flex-column gap-3'>
              {/*  Thông tin tài khoản cá nhân */}
              <FormGroup className='d-flex flex-column gap-2'>
                <FormLabel className='fw-bold w-100 fs-4 border-bottom border-2 border-dark pb-2'>
                  Thông tin tài khoản
                </FormLabel>

                <FormGroup className='d-flex gap-5 justify-content-around'>
                  <FormGroup className='w-100'>
                    <FormLabel className='fw-bold'>Họ Tên</FormLabel>
                    <InputShadow as={FormControl} value={hoten} onChange={e => setHoten(e.target.value)} />
                  </FormGroup>

                  <FormGroup className='w-25'>
                    <FormLabel className='fw-bold'> Giới tính</FormLabel>
                    <InputShadow as={FormSelect} value={gioitinh} onChange={e => setGioitinh(e.target.value)}>
                      <option>Nam</option>
                      <option>Nữ</option>
                    </InputShadow>
                  </FormGroup>
                </FormGroup>

                <FormGroup className='d-flex gap-5 justify-content-around'>
                  <FormGroup className='w-100'>
                    <FormLabel className='fw-bold'>Ngày sinh</FormLabel>
                    <InputShadow as={FormControl} type="date" value={ngaysinh} onChange={e => setNgaysinh(e.target.value)} />
                  </FormGroup>

                  <FormGroup className='w-100'>
                    <FormLabel className='fw-bold'>CCCD</FormLabel>
                    <InputShadow as={FormControl} value={cccd} onChange={e => setCccd(e.target.value)} />
                  </FormGroup>
                </FormGroup>

                <FormGroup className='d-flex gap-5 justify-content-around'>
                  <FormGroup className='w-100'>
                    <FormLabel className='fw-bold'>Email</FormLabel>
                    <InputShadow as={FormControl} type="email" value={email} disabled />
                  </FormGroup>

                  <FormGroup className='w-100'>
                    <FormLabel className='fw-bold'>Số điện thoại</FormLabel>
                    <InputShadow as={FormControl} type="tel" value={sodienthoai} onChange={e => setSodienthoai(e.target.value)} />
                  </FormGroup>
                </FormGroup>
              </FormGroup>

              {/* Địa chỉ */}
              <FormGroup className='d-flex w-100 flex-wrap gap-2'>
                <FormLabel className='fw-bold w-100 fs-4 border-bottom border-2 border-dark pb-2'>
                  Địa chỉ
                </FormLabel>

                <FormGroup className='d-flex gap-5 w-100'>
                  <FormGroup className='w-100'>
                    <FormLabel className='fw-bold'>Tỉnh/Thành phố</FormLabel>
                    <InputShadow as={FormControl} value={tinh} onChange={e => setTinh(e.target.value)} />
                  </FormGroup>
                  <FormGroup className='w-100'>
                    <FormLabel className='fw-bold'>Quận/huyện</FormLabel>
                    <InputShadow as={FormControl} value={quan} onChange={e => setQuan(e.target.value)} />
                  </FormGroup>
                  <FormGroup className='w-100'>
                    <FormLabel className='fw-bold'>Phường/Xã</FormLabel>
                    <InputShadow as={FormControl} value={phuong} onChange={e => setPhuong(e.target.value)} />
                  </FormGroup>
                </FormGroup>

                <FormGroup className='w-100'>
                  <FormLabel className='fw-bold'>Thôn, làng/Đường, ngõ, hẻm</FormLabel>
                  <InputShadow as={FormControl} value={diachi} onChange={e => setDiachi(e.target.value)} />
                </FormGroup>
              </FormGroup>

              {message && (
                <div className={`alert ${message.startsWith('✓') ? 'alert-success' : 'alert-danger'} py-2`}>
                  {message}
                </div>
              )}
            </FormGroup>

            <FormGroup className='justify-content-end d-flex gap-3 w-100 '>
              <Button className='px-5' variant='success' onClick={handleSave} disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu'}
              </Button>
              <Button className='px-5' variant='danger' onClick={() => fetchProfile(manhanvien)}>Hủy</Button>
            </FormGroup>
          </ContentA>
        </div>
      </div>
    </Page1 >
  )
}

export default TaiKhoan