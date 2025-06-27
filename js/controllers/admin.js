//Trang admin

//gọi API 
const API_URL = 'https://685e5bd87b57aebd2af914ed.mockapi.io/Products';
//kiểm tra lỗi dữ liện vào API
import { isRequired, isNumber } from '../utils/validation.js';

// lấy dữ liệu sản phẩm từ API
let allProducts = [];

function fetchProducts() {
    axios.get(API_URL)
        .then(response => {
            allProducts = response.data;
            renderAdminTable(allProducts);
        })
        .catch(error => {
            console.error('Lỗi khi lấy sản phẩm:', error);
        });
}

// sắp xếp sản phẩm
document.getElementById('sortSelect').addEventListener('change', function () {
    const selected = this.value;
    let sorted = [...allProducts];

    if (selected === 'asc') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (selected === 'desc') {
        sorted.sort((a, b) => b.price - a.price);
    }

    renderAdminTable(sorted);
});

//danh sách sản phẩm
function renderAdminTable(products) {
    const tbody = document.getElementById('adminProductTable');
    tbody.innerHTML = '';

    products.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>$${item.price}</td>
        <td><img src="${item.img}" width="50" alt="${item.name}"></td>
        <td>${item.screen}</td>
        <td>${item.backCamera}</td>
        <td>${item.frontCamera}</td>
        <td>${item.desc}</td>
        <td>${item.type}</td>
        <td>
            <button onclick="editProduct('${item.id}')">Sửa</button>
            <button onclick="deleteProduct('${item.id}')">Xóa</button>
        </td>
    `;
        tbody.appendChild(tr);
    });
}

fetchProducts();

// Thêm sản phẩm mới
document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const data = {
        name: document.getElementById('name').value,
        price: +document.getElementById('price').value,
        img: document.getElementById('img').value,
        desc: document.getElementById('desc').value,
        screen: document.getElementById('screen').value,
        backCamera: document.getElementById('backCamera').value,
        frontCamera: document.getElementById('frontCamera').value,
        type: document.getElementById('type').value.toLowerCase()
    };

    // kiem tra dữ liệu
    if (!validateProduct(data)) return;

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal'));

    if (id) {
        // cập nhập
        axios.put(`${API_URL}/${id}`, data)
            .then(() => {
                fetchProducts();
                this.reset();
                modal.hide();
            })
            .catch(err => console.error('Lỗi cập nhật:', err));
    } else {
        // thêm
        axios.post(API_URL, data)
            .then(() => {
                fetchProducts();
                this.reset();
                modal.hide();
            })
            .catch(err => console.error('Lỗi thêm:', err));
    }
});

// Xóa sản phẩm
function deleteProduct(id) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        axios.delete(`${API_URL}/${id}`)
            .then(() => {
                fetchProducts(); // load lại danh sách
            })
            .catch(err => {
                console.error('Lỗi khi xóa sản phẩm:', err);
            });
    }
}

// Sửa sản phẩm
function editProduct(id) {
    axios.get(`${API_URL}/${id}`)
        .then(res => {
            const p = res.data;
            document.getElementById('productId').value = p.id;
            document.getElementById('name').value = p.name;
            document.getElementById('price').value = p.price;
            document.getElementById('screen').value = p.screen;
            document.getElementById('backCamera').value = p.backCamera;
            document.getElementById('frontCamera').value = p.frontCamera;
            document.getElementById('img').value = p.img;
            document.getElementById('desc').value = p.desc;
            document.getElementById('type').value = p.type;

            const modal = new bootstrap.Modal(document.getElementById('productModal'));
            modal.show();
        })
        .catch(err => {
            console.error('Lỗi lấy chi tiết sản phẩm:', err);
        });
}

//goi hàm để sử dụng trong HTML
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;

// validation
function validateProduct(data) {
    let isValid = true;
    if (!isRequired(data.name)) {
        alert('Tên sản phẩm không được để trống');
        isValid = false;
    }
    if (!isNumber(data.price)) {
        alert('Giá sản phẩm phải là số và lớn hơn 0');
        isValid = false;
    }
    if (!isRequired(data.img)) {
        alert('Ảnh không được để trống');
        isValid = false;
    }
    return isValid;
}

// tìm kiếm sản phẩm
document.getElementById('searchInput').addEventListener('input', function () {
    const keyword = this.value.toLowerCase();

    // lọc danh sách
    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    // hiển thị lại danh sách đã lọc
    renderAdminTable(filtered);
});
