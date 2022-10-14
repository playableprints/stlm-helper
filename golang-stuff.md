## New project

    cd my-app-name
    go mod init

## Files and actions

    go get
    go mod tidy

## Code notes

str string to io.Reader: strings.NewReader(str)
str string to byte array: []byte(str)
str string to int: int := strconv.Atoi(str)
str string to int64: int64 := strconv.ParseInt(str, 10, 64)

int to string: fmt.Sprintf("%d", num)

reader to writer: io.Copy(...)

json byte array to map:
jsonbody := make(map[string]string)
err = json.Unmarshal(body, &jsonbody)

byte array to io.Reader: bytes.NewReader(myByteArray)
byte array to string: fmt.Sprintf("%s", jsonbytes)
byte array to hex string: fmt.Sprintf("%x", md5bytes)

io.Reader to byte array: myByteArray, err := ioutil.ReadAll(myIoReader)
json io.Reader to struct: json.NewDecoder(myReader).Decode(&myStruct)

io.Reader to string:
b, err := ioutil.ReadAll(myReader)
mystr = string(b)

map[string]string to json byte array:
myByteArray, err := json.Marshal(myMap)

map[string]string to json string:
jsonbytes, \_ := json.Marshal(myMap)
fmt.Sprintf("%s", jsonbytes)

### Receivers

Methods on structs are "value receivers" and "pointer receivers".

-   Value Rxrs copy the value into the function, making it unmodifiable.
    func (a Animal) GetName() {
    return a.Name
    }

-   Pointer Rxrs copy the pointer to the value, making it modifiable.
    func (a\* Animal) SetName(name string) {
    a.Name = name
    }

https://golangbyexample.com/pointer-receiver-method-golang/

### File reading

To read a file in full: plainstring := ioutil.ReadFile(file)
To get a Reader for a file: filereader := os.Open(file) (\*os.File interface implements Reader)

### Arrays

Array lengths: len(<array>)
Array to slice: array[0:3] -- loweridx:higheridx

https://golangbyexample.com/slice-in-golang/
The format for creating a new slice by re-slicing an existing array is

[n]sample[start:end]
The above operation will return a new slice from the array starting from index start to index end-1. So the element at index end is not included in the newly created slice. While re-slicing , both start and end index is optional.

The default value of the start index is zero
The default value of the end index is the length of the array
