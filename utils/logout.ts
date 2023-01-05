export default function handleLogout() {
  fetch("/api/logout").then(() => {
    window.location.href = "/"
  })
}