const spinner = document.querySelector('.spinner');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', () => {
  spinner.classList.add('spinning');
  setTimeout(() => {
    spinner.classList.remove('spinning');
  }, 3000); // 旋转持续时间
});