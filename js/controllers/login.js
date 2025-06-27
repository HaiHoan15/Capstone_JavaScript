// đăng nhập phân quyền 
function loginAs(role) {
  if (role === 'admin') {
    window.location.href = 'admin.html';
  } else {
    window.location.href = 'home.html';
  }
}
