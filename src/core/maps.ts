
export type KeyboardModeType = Record<string,number>;
    
// for +12
export const keyboardMode0: KeyboardModeType = {
    'q': 48, 'w': 50, 'e': 52, 'r': 53, 't': 55,
    'a': 57, 's': 59, 'd': 60, 'f': 62, 'g': 64,
    'z': 65, 'x': 67, 'c': 69, 'v': 71, 'b': 72,

    'y': 60, 'u': 62, 'i': 64, 'o': 65, 'p': 67,
    'h': 69, 'j': 71, 'k': 72, 'l': 74, ';': 76,
    'n': 77, 'm': 79, ',': 81, '.': 83, '/': 84,
};

// for +1
export const keyboardMode1: KeyboardModeType = {
    'q': 48, 'w': 50, 'e': 52, 'r': 53, 't': 55,
    'a': 57, 's': 59, 'd': 60, 'f': 62, 'g': 64,
    'z': 65, 'x': 67, 'c': 69, 'v': 71, 'b': 72,

    'y': 49, 'u': 51, 'i': 53, 'o': 54, 'p': 56,
    'h': 58, 'j': 60, 'k': 61, 'l': 63, ';': 65,
    'n': 66, 'm': 68, ',': 70, '.': 72, '/': 73,
};

// for -1
export const keyboardMode2: KeyboardModeType = {
    'q': 49, 'w': 51, 'e': 53, 'r': 54, 't': 56,
    'a': 58, 's': 60, 'd': 61, 'f': 63, 'g': 65,
    'z': 66, 'x': 68, 'c': 70, 'v': 72, 'b': 73,

    'y': 48, 'u': 50, 'i': 52, 'o': 53, 'p': 55,
    'h': 57, 'j': 59, 'k': 60, 'l': 62, ';': 64,
    'n': 65, 'm': 67, ',': 69, '.': 71, '/': 72,
};


// for keys pressed to initiate transposing
export type PitchMap = Record<string,number>
export const pitchMap: PitchMap = {
    '`': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, 
    '6': 6, '7': 7, '8': 8, '9': 9, '0':10, '-': 11, 
    '=': 12
};

export type PitchMapReversed = Record<number,string>
export const pitchMapReversed: PitchMapReversed = {
    0:'`', 1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 
    6:'6', 7:'7', 8:'8', 9:'9', 10:'0', 11:'-', 
    12:'='
}

type KeyType = string | number | symbol
export type TransposeMap = Record<string, KeyType>
export const transposeMap: TransposeMap = {
    '0': "C", 
    '1': "C#",
    '2': "D", 
    '3': "D#",
    '4': "E", 
    '5': "F", 
    '6': "F#",
    '7': "G", 
    '8': "G#",
    '9': "A", 
    '10': "Bb",
    '11': "B", 
    '12': "C",
    '13': "C#"
};

export const leftKeyboardKeys: Set<string> = new Set([
    'q','w','e','r','t',
    'a','s','d','f','g',
    'z','x','c','v','b'
])

export const rightKeyboardKeys: Set<string> = new Set([
    'y','u','i','o','p',
    'h','j','k','l',';',
    'n','m',',','.','/'
])


export const relativeMapping: KeyboardModeType = {
    'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4,
    'a': 5, 's': 6, 'd': 7, 'f': 8, 'g': 9,
    'z': 10, 'x': 11, 'c': 12, 'v': 13, 'b': 14,

    'y': 0, 'u': 1, 'i': 2, 'o': 3, 'p': 4,
    'h': 5, 'j': 6, 'k': 7, 'l': 8, ';': 9,
    'n': 10, 'm': 11, ',': 12, '.': 13, '/': 14,
};