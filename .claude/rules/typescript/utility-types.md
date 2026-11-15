# Utility Types Rule

Use TypeScript built-in utility types when they accurately express the transformation. Never manually redeclare a type that a utility type already produces.

## Hard Rules

1. **Use `Partial<T>` for optional update shapes — never redefine the interface with all fields optional.**

   ```typescript
   // ✅ Correct
   type SettingUpdate = Partial<Setting>;

   // ❌ Wrong — manual redeclaration duplicates the source of truth
   interface SettingUpdate {
     id?: string;
     name?: string;
     value?: string;
   }
   ```

2. **Use `Pick<T, K>` to expose a subset of fields — never define a new interface that copies those fields.**

   ```typescript
   // ✅ Correct
   type SettingPublic = Pick<Setting, 'id' | 'name'>;

   // ❌ Wrong — duplicated field declarations diverge silently when Setting changes
   interface SettingPublic {
     id: string;
     name: string;
   }
   ```

3. **Use `Omit<T, K>` to exclude fields — never redefine the interface without those fields.**

   ```typescript
   // ✅ Correct
   type SettingCreate = Omit<Setting, 'id'>;

   // ❌ Wrong — the excluded field must be kept in sync manually
   interface SettingCreate {
     name: string;
     value: string;
   }
   ```

4. **Use `Readonly<T>` to enforce immutability on data structures passed across boundaries.**

   ```typescript
   // ✅ Correct — prevents mutation of shared config at compile time
   type AppConfig = Readonly<Config>;

   // ❌ Wrong — mutable reference leaks mutation risk to all callers
   type AppConfig = Config;
   ```

5. **Use `Record<K, V>` to type dictionaries — never use `{ [key: string]: V }` index signatures.**

   ```typescript
   // ✅ Correct
   type TenantMap = Record<string, Tenant>;

   // ❌ Wrong — index signature is verbose and less discoverable
   type TenantMap = { [key: string]: Tenant };
   ```

6. **Compose utility types for complex shapes — do not chain them beyond two levels.**
   Beyond two levels, extract an intermediate named type to keep the chain readable.

   ```typescript
   // ✅ Correct — two-level composition, intent is clear
   type SettingDraft = Partial<Omit<Setting, 'id'>>;

   // ✅ Correct — three levels: extract an intermediate type
   type SettingBase = Omit<Setting, 'id' | 'createdAt'>;
   type SettingDraft = Partial<SettingBase>;

   // ❌ Wrong — three-level inline chain obscures intent
   type SettingDraft = Readonly<Partial<Omit<Setting, 'id'>>>;
   ```

## Why

Utility types keep derived types synchronized with their source: when the base interface changes, all derived types update automatically. Manual redeclarations create duplicate sources of truth that silently diverge, forcing reviewers to spot inconsistencies by eye rather than letting the compiler enforce correctness.
