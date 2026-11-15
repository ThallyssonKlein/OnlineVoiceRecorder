# Language Rule

All code written under `src/` and `__tests__/` must be in **English** — no exceptions.

## Scope

Applies to every file in the repository:
- Variable names, function names, class names, type names
- Comments and inline documentation
- Log messages (`logger.info`, `logger.warn`, `logger.error`)
- Error messages thrown or returned
- Test descriptions (`describe`, `it`, `test`)
- Commit messages and PR descriptions

## Hard Rules

1. **All identifiers must be English.**
   No Portuguese (or any other language) variable, function, class, or type names.

2. **All string literals intended for logging or errors must be English.**
   ```typescript
   // ✅ Correct
   logger.info('[SettingsPage] Setting not found');
   throw new Error('Invalid setting id');

   // ❌ Wrong
   logger.info('[SettingsPage] Configuração não encontrada');
   throw new Error('Id de configuração inválido');
   ```

3. **All comments must be English.**
   ```typescript
   // ✅ Correct
   // Validates that the auth token is present before sending the request

   // ❌ Wrong
   // Valida que o token de autenticação está presente antes de enviar a requisição
   ```

4. **All test descriptions must be English.**
   ```typescript
   // ✅ Correct
   describe('SettingsPage', () => {
     it('should return all settings for the given user', async () => { ... });
   });

   // ❌ Wrong
   describe('SettingsPage', () => {
     it('deve retornar todas as configurações do usuário', async () => { ... });
   });
   ```

## Why

A consistent English codebase is readable by the full team regardless of native language, aligns with open-source and industry conventions, and prevents mixed-language identifiers that are harder to search and maintain.
