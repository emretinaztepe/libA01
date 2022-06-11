# Lib A01
LibA01 is a library for loading and processing A01 files directly in the browser.

## Advantages
* Implemented in fully in Typescript
* Supports Dependency Injection
* Supports terabyte sized files (streams PPC data)

## How to run? 
### 1. Build it
yarn install\
yarn build\
yarn serve

### 2. Test with sample data
Navigate to http://localhost:8080 \
Open Chrome Dev Tools Console\
Open test_data folder\
Drap and drop sample files to Drop Zone (password is DasPassword) \
Watch A01 lib decrypting files on console messages

## A01 Format Metadata (preliminary)
```yaml
Format: A01
Type: Standard|OffNetwork
ID: 09a2a3d1-d6f9-40b3-a1a9-5ae2f75bbf74
Tool:
Name: AIR
  Version: 1.5.2
Encryption: None|AES-256
PasswordProtected: true
```
