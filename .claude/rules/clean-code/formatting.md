# Formatting Rule

Code must be readable top-to-bottom. Structure and placement are part of the design.

## Hard Rules

1. **Apply the Newspaper Metaphor.**
   High-level concepts first, details below. In a component file the order is: imports → constants → types → the exported component → small private helper components/functions.

   ```tsx
   // ✅ Correct
   export function OrderCard({ order, onClick }: OrderCardProps) {
     return (
       <button type="button" onClick={() => onClick(order.id)} className={styles.container}>
         <OrderTitle title={order.title} />
       </button>
     );
   }

   function OrderTitle({ title }: { title: string }) {
     return <Text style={styles.title}>{title}</Text>;
   }

   const styles = StyleSheet.create({ ... });
   ```

2. **Keep related concepts vertically close.**
   A handler and the function it calls, or a hook and the types it returns, belong next to each other.

3. **Declare variables as close as possible to their first use.**
   Inside components, hooks must still be called unconditionally at the top (Rules of Hooks), but derived values and handlers go right before the JSX that uses them.

   ```tsx
   // ✅ Correct
   function ProfilePage() {
     const { profile } = useProfile();
     const [isEditing, setIsEditing] = useState(false);

     const handleEdit = () => setIsEditing(true);

     return <ProfileView profile={profile} onEdit={handleEdit} />;
   }
   ```

4. **One exported component per file; the file name equals the component name (`PascalCase.tsx`).**
   Hooks live in `useThing.ts`; non-component modules use `camelCase.ts`.

## Why

Code that flows top-to-bottom mirrors how people read. High-level intent first lets a reader decide whether to keep reading. Vertical proximity eliminates scrolling and cross-referencing.
