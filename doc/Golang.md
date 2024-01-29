# Useful snippets of Golang

For a more complete overview of code style and
https://go.dev/doc/effective_go

## New project

    cd my-app-name
    go mod init

## Files and actions

    go get
    go mod tidy

## Code notes

### Variable naming

 * Package names are lowercase, single word and evocative of meaning.
 * Getter functions don't include "Get" in their name.
 * Interfaces are method and -er (eg: agent nouns), eg "Writer", "Formatter"
 * Multiword variables are MixedCaps (CamelCase), not mixedCaps (Pascal-case) or underscore-separated.

### Type conversions

```go

// `str` string to *io.Reader `vioreader`
vioreader := strings.NewReader(str)

// `str` string to byte array `vbytearray`
vbytearray := []byte(str)

// `str` string to int `vint`
vint := strconv.Atoi(str)

// `str` string to int64 `vint64`
vint64 := strconv.ParseInt(str, 10, 64)

// `num` int to string `vstr`
vstr := fmt.Sprintf("%d", num)

// `vreader` reader to writer `vwriter`
vwriter := io.Copy(vreader)

// `jsonbytes` json byte array to map `jsonmap`
jsonmap := make(map[string]string)
err = json.Unmarshal(jsonbytes, &jsonmap)

// `vbytearray` byte array to *io.Reader `vreader`
vreader := bytes.NewReader(vbytearray)

// `vbytearray` byte array to string `vstr`
vstr := fmt.Sprintf("%s", vbytearray)

// `vbytearray` byte array to hex string `hexstr`
hexstr := fmt.Sprintf("%x", vbytearray)

// `vreader` io.Reader to byte array `vbytearray`
vbytearray, err := ioutil.ReadAll(vreader)

// `jreader` json io.Reader to struct `myStruct`
json.NewDecoder(jreader).Decode(&myStruct)

// `myReader` io.Reader to string `vstr`
b, err := ioutil.ReadAll(myReader)
vstr = string(b)

// `jsonmap` map[string]string to json byte array `jsonbytes`
jsonbytes, err := json.Marshal(jsonmap)

// `jsonmap` map[string]string to json string `jsonstr`
jsonbytes, _ := json.Marshal(jsonmap)
jsonstr := fmt.Sprintf("%s", jsonbytes)

```

### Receivers

Methods on structs are "value receivers" and "pointer receivers".

```go
// Value Rxrs copy the value into the function, making it unmodifiable.
func (a Animal) GetName() {
    return a.Name
}

// Pointer Rxrs copy the pointer to the value, making it modifiable.
func (a\* Animal) SetName(name string) {
    a.Name = name
}
```

https://golangbyexample.com/pointer-receiver-method-golang/

### File reading

```go
// To read a file in full
// https://pkg.go.dev/os#ReadFile
vbytes, err := os.ReadFile(file)

// To get a Reader `*vfile` from a string `file`
// https://pkg.go.dev/os#Open
vfile, err := os.Open(file)

/* *os.File interface implements Reader, so:

vfile.Read(...)
vfile.Close(...)

etc all function.
https://pkg.go.dev/os#File.Read
*/

```

### Arrays

```go

// `arraylen` array lengths of array `varray`
arraylen := len(varray)

// `varray` array to slice `vslice`
// Index values are: loweridx:higheridx
vslice := varray[0:3]

```

https://golangbyexample.com/slice-in-golang/
The format for creating a new slice by re-slicing an existing array is

`[n]sample[start:end]`

The above operation will return a new slice from the array starting from index start to index end-1. So the element at index end is not included in the newly created slice. While re-slicing , both start and end index is optional.

The default value of the start index is zero
The default value of the end index is the length of the array
