# Grovine

## Development

### Installing Dependencies

```bash
pnpm install
```

### Environment Variables
This project uses direnv to manage environment variables. With the current setup, you just need to
- Copy `.env.example` to `.env`.
```bash
cp .env.example .env
```
- And then copy `.env.development.example` to `.env.development`.
```bash
cp .env.development.example .env.development
```
- Then make sure direnv is allowed in this project folder
```bash
direnv allow
```

And you should be good to go.

### Contributing

```bash
pnpm dev
```

## Important Links

- [Figma](https://www.figma.com/design/hjWaYA2OhfOILMoFOYYuFh/Grovine-App-Design?node-id=3-3347&p=f&t=EPbmzfSurCoVhUik-0)
