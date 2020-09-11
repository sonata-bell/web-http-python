const form = document.querySelector('form');
const input = document.querySelector('input');
const output = document.querySelector('h3');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (input.value) {
    const { data } = await axios.post('/data', { data: input.value });

    return (output.innerText = `결과: ${data}`);
  }

  alert('데이터를 입력하세요.');
});
