import { useState } from 'react';

// --- 3. Component cháu/con: StudentItem ---
const StudentItem = ({ student, onDelete }) => {
  // Sử dụng Destructuring Assignment để bóc tách dữ liệu
  const { id, name, score, class: className } = student;

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{score}</td>
      <td>{className}</td>
      <td>
        <button onClick={() => onDelete(id)}>Xóa</button>
      </td>
    </tr>
  );
};

// --- 2. Component con: StudentList ---
const StudentList = ({ students, onDelete }) => {
  return (
    <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', marginTop: '20px' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Điểm số</th>
          <th>Lớp</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {/* Sử dụng phương thức .map() của ES6 */}
        {students.map((student) => (
          <StudentItem key={student.id} student={student} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
};

// --- 1. Component cha: App ---
const App = () => {
  // Mảng dữ liệu mẫu tối thiểu 3 sinh viên
  const initialStudents = [
    { id: 1, name: 'Nguyễn Văn A', score: 8.5, class: 'CMA03.9A' },
    { id: 2, name: 'Trần Thị B', score: 4.0, class: 'CMA03.9B' },
    { id: 3, name: 'Lê Văn C', score: 7.5, class: 'CMA03.9A' },
  ];

  // Quản lý state chính bằng let/const
  const [students, setStudents] = useState(initialStudents);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'GIOI', 'TRUOT'
  
  const [formData, setFormData] = useState({ name: '', score: '', className: '' });
  const [errorMsg, setErrorMsg] = useState('');

  // Sử dụng Arrow Functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const { name, score, className } = formData;

    // Ràng buộc dữ liệu: Kiểm tra trống
    if (!name || !score || !className) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const numScore = parseFloat(score);
    // Ràng buộc dữ liệu: Kiểm tra điểm hợp lệ
    if (numScore < 0 || numScore > 10) {
      setErrorMsg('Điểm số không hợp lệ (phải từ 0 đến 10)!');
      return;
    }

    setErrorMsg('');
    const newStudent = {
      id: Date.now(),
      name,
      score: numScore,
      class: className,
    };

    setStudents([...students, newStudent]);
    setFormData({ name: '', score: '', className: '' }); // Reset form
  };

  const handleDelete = (id) => {
    // Sử dụng phương thức .filter() của ES6
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  // Tính năng lọc
  const getFilteredStudents = () => {
    if (filterType === 'GIOI') return students.filter((s) => s.score >= 8);
    if (filterType === 'TRUOT') return students.filter((s) => s.score < 5);
    return students; // 'ALL'
  };

  const displayedStudents = getFilteredStudents();

  // Thống kê cơ bản của toàn lớp (tính trên mảng students gốc)
  const totalStudents = students.length;
  
  // Sử dụng phương thức .reduce() của ES6
  const averageScore = totalStudents > 0
    ? students.reduce((sum, student) => sum + student.score, 0) / totalStudents
    : 0;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h2>Ứng dụng "Quản lý Điểm Sinh viên"</h2>

      <form onSubmit={handleAddStudent} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>Thêm sinh viên mới</h3>
        {errorMsg && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMsg}</p>}
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="score"
            placeholder="Điểm số"
            step="0.1"
            value={formData.score}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="className"
            placeholder="Lớp"
            value={formData.className}
            onChange={handleInputChange}
          />
          <button type="submit">Thêm</button>
        </div>
      </form>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9' }}>
        {/* Sử dụng Template Literals để nối chuỗi */}
        <p><strong>{`Tổng số lượng sinh viên toàn lớp: ${totalStudents}`}</strong></p>
        <p><strong>{`Điểm trung bình toàn lớp: ${averageScore.toFixed(2)}`}</strong></p>
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setFilterType('ALL')}>Tất cả</button>
        <button onClick={() => setFilterType('GIOI')}>Sinh viên Giỏi (Điểm &gt;= 8)</button>
        <button onClick={() => setFilterType('TRUOT')}>Sinh viên Trượt (Điểm &lt; 5)</button>
      </div>

      <StudentList students={displayedStudents} onDelete={handleDelete} />
    </div>
  );
};

export default App;