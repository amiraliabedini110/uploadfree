// توابع عمومی احراز هویت
window.auth = {
    // نمایش اعلان
    showToast: function(title, message, type = 'info') {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.id = 'toastContainer';
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-circle' : 
                     type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
        
        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
    },
    
    // بررسی اینکه کاربر وارد شده است یا نه
    isLoggedIn: function() {
        return localStorage.getItem('currentUser') !== null;
    },
    
    // دریافت اطلاعات کاربر فعلی
    getCurrentUser: function() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    // خروج از حساب
    logout: function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },
    
    // ذخیره کاربر پیش‌فرض
    initializeDefaultUser: function() {
        const defaultUser = {
            email: 'vared konid',
            password: 'vared konid',
            name: ' برای نمایش نام ثبت نام کنید',
            joinDate: '۱۴۰۲/۰۱/۱۵'
        };
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const defaultUserExists = users.some(u => u.email === defaultUser.email);
        
        if (!defaultUserExists) {
            users.push(defaultUser);
            localStorage.setItem('users', JSON.stringify(users));
        }
    },
    
    // اعتبارسنجی ایمیل
    validateEmail: function(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // اعتبارسنجی رمز عبور
    validatePassword: function(password) {
        return password && password.length >= 6;
    },
    
    // بررسی اینکه آیا ایمیل قبلاً ثبت شده است
    isEmailRegistered: function(email) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.some(user => user.email === email);
    },
    
    // ثبت کاربر جدید
    registerUser: function(userData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    },
    
    // ورود کاربر
    loginUser: function(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const session = {
                email: user.email,
                name: user.name,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(session));
            return user;
        }
        
        return null;
    },
    
    // گرفتن اولین حرف نام برای آواتار
    getAvatarLetter: function(name) {
        return name ? name.charAt(0) : '?';
    },
    
    // فرمت کردن تاریخ
    formatDate: function(dateString) {
        if (!dateString) return 'نامشخص';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fa-IR');
        } catch (e) {
            return dateString;
        }
    },
    
    // گرفتن زمان نسبی
    getRelativeTime: function(dateString) {
        if (!dateString) return 'نامشخص';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            
            if (diffMins < 1) {
                return 'لحظاتی پیش';
            } else if (diffMins < 60) {
                return `${diffMins} دقیقه پیش`;
            } else if (diffMins < 1440) {
                const hours = Math.floor(diffMins / 60);
                return `${hours} ساعت پیش`;
            } else {
                const days = Math.floor(diffMins / 1440);
                return `${days} روز پیش`;
            }
        } catch (e) {
            return 'نامشخص';
        }
    }
};

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    // ایجاد کاربر پیش‌فرض اگر وجود ندارد
    auth.initializeDefaultUser();
    
    // افزودن CSS برای انیمیشن‌های اضافی
    const style = document.createElement('style');
    style.textContent = `
        .shake {
            animation: shake 0.5s ease;
        }
        
        .pulse {
            animation: pulse 1s ease;
        }
        
        .success-animation {
            position: relative;
        }
        
        .success-animation::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(16, 185, 129, 0.1), transparent);
            animation: success-shine 1.5s ease;
        }
        
        .error-animation {
            position: relative;
        }
        
        .error-animation::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(239, 68, 68, 0.1), transparent);
            animation: success-shine 1.5s ease;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.02);
            }
        }
        
        button {
            position: relative;
            overflow: hidden;
        }
        
        button .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);
    
    // افزودن افکت ripple به دکمه‌ها
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
});

// تابع showToast عمومی
function showToast(title, message, type = 'info') {
    window.auth.showToast(title, message, type);
}
// سیستم احراز هویت و فایل برای فضای ابری موبایلی
window.cloudAuth = {
    // نمایش اعلان
    showToast: function(title, message, type = 'info') {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.id = 'toastContainer';
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-circle' : 
                     type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
        
        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
    },
    
    // بررسی اینکه کاربر وارد شده است یا نه
    isLoggedIn: function() {
        return localStorage.getItem('currentUser') !== null;
    },
    
    // دریافت اطلاعات کاربر فعلی
    getCurrentUser: function() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    // خروج از حساب
    logout: function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },
    
    // ذخیره کاربر پیش‌فرض
    initializeDefaultUser: function() {
        const defaultUser = {
            email: 'amiraliabedini103@gmail.com',
            password: 'amirali1400',
            name: 'امیرعلی عابدینی',
            joinDate: new Date().toLocaleDateString('fa-IR'),
            storageLimit: 500 * 1024 * 1024, // 500MB
            usedStorage: 0
        };
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const defaultUserExists = users.some(u => u.email === defaultUser.email);
        
        if (!defaultUserExists) {
            users.push(defaultUser);
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // ایجاد فضای ذخیره‌سازی پیش‌فرض
        if (!localStorage.getItem(`user_files_${defaultUser.email}`)) {
            localStorage.setItem(`user_files_${defaultUser.email}`, JSON.stringify([]));
        }
    },
    
    // اعتبارسنجی ایمیل
    validateEmail: function(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // اعتبارسنجی رمز عبور
    validatePassword: function(password) {
        return password && password.length >= 6;
    },
    
    // ثبت کاربر جدید
    registerUser: function(userData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        userData.storageLimit = 500 * 1024 * 1024; // 500MB برای کاربر جدید
        userData.usedStorage = 0;
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        
        // ایجاد فضای ذخیره‌سازی خالی
        localStorage.setItem(`user_files_${userData.email}`, JSON.stringify([]));
        
        return true;
    },
    
    // ورود کاربر
    loginUser: function(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const session = {
                email: user.email,
                name: user.name,
                loginTime: new Date().toISOString(),
                storageLimit: user.storageLimit || 500 * 1024 * 1024,
                usedStorage: user.usedStorage || 0
            };
            localStorage.setItem('currentUser', JSON.stringify(session));
            return user;
        }
        
        return null;
    },
    
    // به‌روزرسانی فضای ذخیره‌سازی
    updateStorageUsage: function(email, fileSize) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex !== -1) {
            users[userIndex].usedStorage = (users[userIndex].usedStorage || 0) + fileSize;
            localStorage.setItem('users', JSON.stringify(users));
            
            // به‌روزرسانی session
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.email === email) {
                currentUser.usedStorage = users[userIndex].usedStorage;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
    },
    
    // بررسی فضای ذخیره‌سازی
    checkStorageSpace: function(email, fileSize) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) return false;
        
        const storageLimit = user.storageLimit || 500 * 1024 * 1024;
        const usedStorage = user.usedStorage || 0;
        
        return (usedStorage + fileSize) <= storageLimit;
    },
    
    // گرفتن اطلاعات فضای ذخیره‌سازی
    getStorageInfo: function(email) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) return { used: 0, total: 500 * 1024 * 1024, percentage: 0 };
        
        const used = user.usedStorage || 0;
        const total = user.storageLimit || 500 * 1024 * 1024;
        const percentage = total > 0 ? Math.round((used / total) * 100) : 0;
        
        return { used, total, percentage };
    }
};

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    // ایجاد کاربر پیش‌فرض اگر وجود ندارد
    cloudAuth.initializeDefaultUser();
});