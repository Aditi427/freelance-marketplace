document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        username: registerForm.querySelector('input[placeholder="Full Name"]').value.trim(),
        email: registerForm.querySelector('input[type="email"]').value.trim(),
        password: registerForm.querySelector('input[type="password"]').value,
        role: registerForm.querySelector('select').value,
      };

      try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
          alert("Registration successful!");
          // Save token to localStorage/sessionStorage for auth
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);

          // Redirect based on role
          if (data.role === 'client') {
            window.location.href = 'client-dashboard.html';
          } else if (data.role === 'freelancer') {
            window.location.href = 'freelancer-dashboard.html';
          }
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (error) {
        alert("Error connecting to server");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        email: loginForm.querySelector('input[type="email"]').value.trim(),
        password: loginForm.querySelector('input[type="password"]').value,
      };

      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
          alert("Login successful!");
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);

          if (data.role === 'client') {
            window.location.href = 'client-dashboard.html';
          } else if (data.role === 'freelancer') {
            window.location.href = 'freelancer-dashboard.html';
          }
        } else {
          alert(data.message || "Login failed");
        }
      } catch (error) {
        alert("Error connecting to server");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const postJobForm = document.getElementById("postJobForm");
  if (postJobForm) {
    postJobForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const jobData = {
        title: document.getElementById("jobTitle").value.trim(),
        category: document.getElementById("jobCategory").value.trim(),
        budget: Number(document.getElementById("jobBudget").value),
        deadline: document.getElementById("jobDeadline").value,
        description: document.getElementById("jobDescription").value.trim(),
      };

      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5000/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(jobData)
        });

        const data = await res.json();

        if (res.ok) {
          alert('Job posted successfully!');
          postJobForm.reset();
        } else {
          alert(data.message || 'Failed to post job');
        }
      } catch (err) {
        alert('Error connecting to server');
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById('freelancerJobsList')) {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const jobs = await res.json();
      const jobsContainer = document.getElementById('freelancerJobsList');
      jobsContainer.innerHTML = '';
      if (jobs.length === 0) {
        jobsContainer.innerHTML = '<p>No jobs loaded.</p>';
      } else {
        jobs.forEach(job => {
          const div = document.createElement('div');
          div.classList.add('job-item');
          div.innerHTML = `
            <h3>${job.title}</h3>
            <p>Category: ${job.category}</p>
            <p>Budget: $${job.budget}</p>
            <p>Deadline: ${new Date(job.deadline).toLocaleDateString()}</p>
            <p>${job.description}</p>
          `;
          jobsContainer.appendChild(div);
        });
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    }
  }
});


