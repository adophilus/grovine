# Grovine

## Development

### Installing Dependencies

```bash
pnpm install
```

### Contributing

```bash
pnpm --filter @grovine/backend dev # to run the backend
pnpm --filter @grovine/docs dev # to run the docs
# NOTE: If you're running them singly changes made to the docs-openapi (docs.tsp) won't be reflected until you rebuild the docs-openapi
pnpm --filter @grovine/docs-openapi build
pnpm --filter @grovine/api build
# Or you can just run this to rebuild automatically
pnpm --filter @grovine/docs-openapi dev
pnpm --filter @grovine/api dev

# Alternatively (Recommended)
pnpm dev # to run the whole stack
```

## Important Links

- [Figma](https://www.figma.com/design/hjWaYA2OhfOILMoFOYYuFh/Grovine-App-Design?node-id=3-3347&p=f&t=EPbmzfSurCoVhUik-0)
