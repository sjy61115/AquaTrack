import { API_BASE } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // ✅ [추가] 이메일 중복 확인 기능
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        const errorElem = document.getElementById('email-error');
        if (!email.includes('@')) return;

        fetch(`${API_BASE}/api/auth/check-email?email=${encodeURIComponent(email)}`)
            .then(res => res.json())
            .then(isUsed => {
                if (isUsed) {
                    errorElem.textContent = '이미 사용 중인 이메일입니다.';
                    errorElem.style.display = 'block';
                } else {
                    errorElem.style.display = 'none';
                }
            })
            .catch(err => {
                console.error('이메일 중복 확인 오류:', err);
            });
    });

    // 약관 보기 모달 열기/닫기
    document.getElementById('view-terms').addEventListener('click', () => {
        document.getElementById('terms-modal').classList.remove('hidden');
    });

    document.getElementById('close-terms').addEventListener('click', () => {
        document.getElementById('terms-modal').classList.add('hidden');
    });

    // 회원가입 버튼 클릭
    document.getElementById('signup-button').onclick = () => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const phone = document.getElementById('phone').value.trim();
        const agree = document.getElementById('agree-terms').checked;
        const phoneRegex = /^01[016789]\d{7,8}$/;

        console.log({ name, email, password, phone });

        // 오류 메시지 초기화
        document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');

        let valid = true;

        // 유효성 검사
        if (!email.includes('@')) {
            document.getElementById('email-error').style.display = 'block';
            valid = false;
        }

        if (email === password) {
            document.getElementById('password-same-error').style.display = 'block';
            valid = false;
        }

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);
        if (!(hasLetter && hasNumber && hasSpecial)) {
            document.getElementById('password-format-error').style.display = 'block';
            valid = false;
        }

        if (/(.)\1{3,}/.test(password)) {
            document.getElementById('password-repeat-error').style.display = 'block';
            valid = false;
        }

        if (password !== confirmPassword) {
            document.getElementById('confirm-password-error').style.display = 'block';
            valid = false;
        }

        if (!phoneRegex.test(phone)) {
            document.getElementById('phone-error').style.display = 'block';
            valid = false;
        }

        if (!name || !email || !password || !confirmPassword || !phone) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (!agree) {
            alert('이용약관에 동의해주세요.');
            return;
        }

        if (!valid) return; // ❗ 여기서 실패 시 종료!

        // ✅ 여기까지 왔으면 유효성 통과 → fetch 실행
        fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: name, email, password, phone })
        })
            .then(res => {
                if (!res.ok) throw new Error('회원가입 실패');
                return res.text();
            })
            .then(msg => {
                alert(msg || '회원가입이 완료되었습니다!');
                window.location.href = 'login.html';
            })
            .catch(err => {
                alert('에러: ' + err.message);
            });
    };
});
