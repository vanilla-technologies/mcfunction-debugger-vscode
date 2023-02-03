# Change Log

## [Unreleased]

- Fix error /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.32' not found on Ubuntu 20.04 (only affected prebuilt binaries)
- Fix bug that crashed debug sessions instantly on linux and macOS, because debug adapter binary was not marked as executable (with `chmod +x`)

## [1.0.2]

- Fix Extension for macOS and processor architectures other that x86_64.

## [1.0.1]

- No changes

## [1.0.0]

- Initial release
