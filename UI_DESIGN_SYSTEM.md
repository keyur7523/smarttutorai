# 🎨 SmartTutor UI Design System

## 📋 **CRITICAL: This UI Design System MUST be preserved for all future features**

This document defines the complete UI design system, patterns, and components that form the foundation of SmartTutor. **Every new feature must follow these exact patterns.**

---

## 🎯 **Core Design Principles**

### 1. **Visual Hierarchy**
- **Primary Brand Color**: Blue (`blue-600`, `#2563eb`)
- **Secondary Colors**: Purple (`purple-600`), Green (`green-600`), Yellow (`yellow-500`)
- **Gradient Backgrounds**: `bg-gradient-to-br from-blue-50 via-white to-purple-50`
- **Card Styling**: `border-0 shadow-lg bg-white/80 backdrop-blur`

### 2. **Typography**
- **Font**: Inter (Google Fonts)
- **Headings**: `text-4xl md:text-5xl font-bold` with gradient text
- **Body Text**: `text-muted-foreground` for descriptions
- **Gradient Text**: `bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`

### 3. **Spacing & Layout**
- **Container**: `container mx-auto px-4`
- **Section Spacing**: `py-6`, `py-8`, `py-12`
- **Grid Layouts**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Card Spacing**: `space-y-4`, `space-y-6`

---

## 🧩 **Component Patterns**

### **1. Navigation Bar**
```tsx
<nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      {/* Logo with icon */}
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
        <BookOpen className="h-6 w-6" />
        SmartTutor
      </Link>
      
      {/* Action buttons with tooltips */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Icon className="h-4 w-4" />
              Action
            </Button>
          </TooltipTrigger>
          <TooltipContent>Description</TooltipContent>
        </Tooltip>
      </div>
    </div>
  </div>
</nav>
```

### **2. Hero Section**
```tsx
<div className="text-center space-y-6 mb-12">
  <div className="flex items-center justify-center gap-3 mb-6">
    <div className="p-3 bg-blue-600 rounded-xl">
      <Icon className="h-8 w-8 text-white" />
    </div>
    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Title
    </h1>
  </div>
  
  <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
    Description text
  </p>
  
  <Button size="lg" className="text-lg px-8 py-6">
    Action
    <Icon className="ml-2 h-5 w-5" />
  </Button>
</div>
```

### **3. Feature Cards**
```tsx
<Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
  <CardHeader>
    <div className="flex items-center gap-2">
      <Icon className="h-6 w-6 text-blue-600" />
      <CardTitle className="text-lg">Feature Title</CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">
      Feature description
    </p>
    <div className="flex gap-2 mt-3">
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Tag
      </Badge>
    </div>
  </CardContent>
</Card>
```

### **4. Process Steps**
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <div className="text-center space-y-3">
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
      <span className="text-blue-600 font-bold">1</span>
    </div>
    <h3 className="font-semibold">Step Title</h3>
    <p className="text-sm text-muted-foreground">Step description</p>
  </div>
</div>
```

### **5. Topic Grid**
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {topics.map((topic) => (
    <div
      key={topic}
      className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center border border-blue-100"
    >
      <span className="font-medium text-blue-800">{topic}</span>
    </div>
  ))}
</div>
```

---

## 🎨 **Color System**

### **Primary Colors**
- **Blue**: `blue-600` (#2563eb) - Primary brand color
- **Purple**: `purple-600` (#9333ea) - Secondary brand color
- **Green**: `green-600` (#16a34a) - Success states
- **Yellow**: `yellow-500` (#eab308) - Warning states
- **Red**: `red-600` (#dc2626) - Error states

### **Background Colors**
- **Main Background**: `bg-gradient-to-br from-blue-50 via-white to-purple-50`
- **Card Background**: `bg-white/80 backdrop-blur`
- **Muted Background**: `bg-muted/50`

### **Badge Colors**
- **Easy**: `bg-green-100 text-green-800`
- **Medium**: `bg-yellow-100 text-yellow-800`
- **Hard**: `bg-red-100 text-red-800`
- **Info**: `bg-blue-100 text-blue-800`
- **Purple**: `bg-purple-100 text-purple-800`

---

## 📱 **Layout Patterns**

### **1. Three-Column Layout (Learn Page)**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  {/* Left Column - Sidebar */}
  <div className="lg:col-span-3 space-y-4">
    <Component1 />
    <Component2 />
  </div>
  
  {/* Center Column - Main Content */}
  <div className="lg:col-span-6">
    <MainComponent />
  </div>
  
  {/* Right Column - Metrics */}
  <div className="lg:col-span-3">
    <MetricsComponent />
  </div>
</div>
```

### **2. Feature Grid Layout**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
  <FeatureCard />
  <FeatureCard />
  <FeatureCard />
</div>
```

### **3. Stats Grid Layout**
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
  <div>
    <div className="text-2xl font-bold text-blue-600">{value}</div>
    <div className="text-sm text-muted-foreground">Label</div>
  </div>
</div>
```

---

## 🔧 **Interactive Elements**

### **Buttons**
- **Primary**: `Button size="lg" className="text-lg px-8 py-6"`
- **Secondary**: `Button variant="outline" size="lg"`
- **Ghost**: `Button variant="ghost" size="sm"`
- **With Icons**: Always include icons with `className="ml-2 h-5 w-5"`

### **Loading States**
```tsx
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
<p>Loading message...</p>
```

### **Tooltips**
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Trigger</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 📊 **Data Visualization**

### **Progress Bars**
```tsx
<ProgressBar 
  value={percentage} 
  label="Label" 
  color="green" 
  showPercentage={true} 
/>
```

### **Charts**
- Use `PerformanceChart` component with types: `"accuracy"`, `"speed"`, `"level"`
- Always wrap in `Card` with `CardHeader` and `CardTitle`

### **Metrics Display**
```tsx
<div className="text-center p-4 bg-blue-50 rounded-lg">
  <div className="text-3xl font-bold text-blue-600">{value}</div>
  <div className="text-sm text-blue-700">Label</div>
  <Badge variant="outline" className="mt-2">Status</Badge>
</div>
```

---

## 🎯 **Page-Specific Patterns**

### **Home Page**
- Hero section with gradient background
- Feature cards in 3-column grid
- "How It Works" process steps
- Topic grid
- Call-to-action buttons

### **Learn Page**
- Three-column layout (sidebar, main, metrics)
- Problem card in center
- Session management in sidebar
- Performance indicators on right

### **Summary Page**
- Centered header with trophy icon
- Performance summary cards
- Chart grid (2 columns)
- Study plan with numbered steps
- Action buttons at bottom

---

## 🚨 **CRITICAL RULES**

### **MUST DO:**
1. ✅ Always use the gradient background: `bg-gradient-to-br from-blue-50 via-white to-purple-50`
2. ✅ Use `border-0 shadow-lg bg-white/80 backdrop-blur` for all cards
3. ✅ Include icons with all buttons and headings
4. ✅ Use the exact color system defined above
5. ✅ Follow the spacing patterns (`space-y-6`, `gap-6`, etc.)
6. ✅ Use `container mx-auto px-4` for page containers
7. ✅ Include tooltips for interactive elements
8. ✅ Use the exact typography hierarchy

### **NEVER DO:**
1. ❌ Change the primary color scheme
2. ❌ Remove the gradient backgrounds
3. ❌ Use different card styling
4. ❌ Change the navigation structure
5. ❌ Modify the spacing system
6. ❌ Remove icons from buttons
7. ❌ Use different typography
8. ❌ Break the responsive grid system

---

## 📝 **Implementation Checklist**

When adding new features, ensure:

- [ ] Uses the exact color system
- [ ] Follows the card styling pattern
- [ ] Includes proper icons
- [ ] Uses the correct spacing
- [ ] Implements responsive design
- [ ] Includes loading states
- [ ] Has proper tooltips
- [ ] Follows the layout patterns
- [ ] Uses the typography hierarchy
- [ ] Maintains the gradient background

---

**Remember: This UI design system is the foundation of SmartTutor. Every new feature must seamlessly integrate with this established design language.**
