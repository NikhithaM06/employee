import { useEffect, useMemo, useState } from 'react';

const domains = ['Developer', 'QA', 'HR', 'Finance'];

export default function EmployeeForm({ initialData = {}, onSubmit, submitLabel, isSubmitting, onCancel }) {
  const [name, setName] = useState(initialData.name || '');
  const [age, setAge] = useState(initialData.age || '');
  const [experience, setExperience] = useState(initialData.experience || '');
  const [previousCompany, setPreviousCompany] = useState(initialData.previousCompany || '');
  const [domain, setDomain] = useState(initialData.domain || 'Developer');
  const [skills, setSkills] = useState((initialData.skills && initialData.skills.join(', ')) || '');
  const [salary, setSalary] = useState(initialData.salary || '');
  const [image, setImage] = useState(initialData.image || '');
  const [leftDate, setLeftDate] = useState(initialData.leftDate ? new Date(initialData.leftDate).toISOString().split('T')[0] : '');
  const [fileLabel, setFileLabel] = useState('Choose an image file');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(initialData.name || '');
    setAge(initialData.age || '');
    setExperience(initialData.experience || '');
    setPreviousCompany(initialData.previousCompany || '');
    setDomain(initialData.domain || 'Developer');
    setSkills((initialData.skills && initialData.skills.join(', ')) || '');
    setSalary(initialData.salary || '');
    setImage(initialData.image || '');
    setLeftDate(initialData.leftDate ? new Date(initialData.leftDate).toISOString().split('T')[0] : '');
    setFileLabel('Choose an image file');

    setErrors({});
  }, [initialData]);

  const previewImage = useMemo(
    () => image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    [image]
  );

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileLabel(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Full Name is required';
    if (!age || Number(age) <= 18) nextErrors.age = 'Age must be greater than 18';
    if (!experience || Number(experience) < 0) nextErrors.experience = 'Experience is required';
    if (!previousCompany.trim()) nextErrors.previousCompany = 'Previous Company is required';
    if (!domain) nextErrors.domain = 'Domain is required';
    if (!skills.trim()) nextErrors.skills = 'At least one skill is required';
    if (!salary || Number.isNaN(Number(salary))) nextErrors.salary = 'Salary must be a number';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      age: Number(age),
      experience: Number(experience),
      previousCompany: previousCompany.trim(),
      domain,
      skills: skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      salary: Number(salary),
      image,
      status: initialData.status || 'active',
      leftDate: (initialData.status === 'past' || leftDate) ? leftDate : undefined
    });

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="block text-sm font-medium text-slate-700">Full Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-slate-700">Age</span>
          <input
            type="number"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            min="19"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          {errors.age && <p className="text-sm text-red-600">{errors.age}</p>}
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-slate-700">Experience (years)</span>
          <input
            type="number"
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
            min="0"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          {errors.experience && <p className="text-sm text-red-600">{errors.experience}</p>}
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-slate-700">Salary</span>
          <input
            type="number"
            value={salary}
            onChange={(event) => setSalary(event.target.value)}
            min="0"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          {errors.salary && <p className="text-sm text-red-600">{errors.salary}</p>}
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-slate-700">Domain</span>
          <select
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          >
            {domains.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.domain && <p className="text-sm text-red-600">{errors.domain}</p>}
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="block text-sm font-medium text-slate-700">Skills</span>
          <input
            type="text"
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            placeholder="e.g. React, Node.js, QA"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          {errors.skills && <p className="text-sm text-red-600">{errors.skills}</p>}
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="block text-sm font-medium text-slate-700">Previous Company</span>
          <input
            type="text"
            value={previousCompany}
            onChange={(event) => setPreviousCompany(event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          {errors.previousCompany && <p className="text-sm text-red-600">{errors.previousCompany}</p>}
        </label>

        {initialData.status === 'past' && (
          <label className="space-y-2 md:col-span-2">
            <span className="block text-sm font-medium text-slate-700">Left Date</span>
            <input
              type="date"
              value={leftDate}
              onChange={(event) => setLeftDate(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        )}

        <label className="space-y-2 md:col-span-2">

          <span className="block text-sm font-medium text-slate-700">Profile Image</span>
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none file:cursor-pointer file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-700"
            />
            <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              {fileLabel}
            </div>
          </div>
          {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-[120px_1fr] md:items-center">
        <div className="text-sm font-medium text-slate-700">Preview</div>
        <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <img src={previewImage} alt="Employee preview" className="h-20 w-20 rounded-3xl object-cover" />
          <div className="text-slate-600">Uploaded profile image will be saved as a URL string or base64 data.</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
