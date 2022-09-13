const url = '../api/hello';

async function hello () {
    try {
        const res = await fetch(url);
        const hello = await res.json();
        const text: string = hello.message.text;
        const selector: string = hello.message.selector;
        const dom: HTMLButtonElement = document.querySelector(selector) as HTMLButtonElement;

        if (!text) {
            throw new Error('テキストが見つからないYo！');
        } else if (!selector) {
            throw new Error('セレクタ名が見つからないYo！');
        } else if (!dom) {
            throw new Error('DOMが見つからないYo！');
        }

        dom.innerHTML = text;
        console.log('text-> ' + text);
      } catch(err) {
        console.log('err!');
        console.log(err);
    }
};

export { hello };