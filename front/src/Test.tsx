type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
    return sanitize(str);
}

function sanitize(str: string): string {
    return `sanitize return ! ${str}`;
}


// 보안 처리를 마친 입력을 생성
let userInput = sanitizeInput('test');

// 물론 새로운 문자열을 다시 대입할 수도 있습니다
userInput = 'Hello world';
// userInput = 1004;



type Animal = {
    name: string
}

type Bear = Animal & {
    honey: boolean
}

const bear: Bear = {name : 'test', honey: false};


export const Test = () => {

    return (
        <ul>
            <li>{'userInput : ' + userInput}</li>
            <li>{bear.name}</li>
            <li>{bear.honey ? 'true' : 'false'}</li>
        </ul>
    )
}

export default Test
