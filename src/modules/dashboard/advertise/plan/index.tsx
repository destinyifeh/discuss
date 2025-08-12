'use client';

import {PageHeader} from '@/components/app-headers';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {toast} from '@/components/ui/toast';
import {Sections} from '@/constants/data';
import {
  BASIC_PLAN_DESCRIPTION,
  basicAdTypes,
  basicDurations,
  ctaBtn,
  ENTERPRISE_PLAN_DESCRIPTION,
  enterPriseAdTypes,
  enterpriseDurations,
  PROFESSIONAL_PLAN_DESCRIPTION,
  professionalAdTypes,
  professionalDurations,
} from '@/fixtures/ad';
import {useAdStore} from '@/hooks/stores/use-ad-store';
import {AdCTA, AdPlan, AdType, DurationValue} from '@/types/ad-types';
import {ArrowRight, CheckCircle, Upload} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {ChangeEvent, Fragment, useRef, useState} from 'react';
import {CreateAdDto} from '../dto/create-ad.dto';
import {AdPreviewPage} from '../preview';

export const AdPlanPage = () => {
  // const {plan} = useParams<{plan: AdPlan}>();
  const searchParam = useSearchParams();

  const plan = searchParam.get('plan') as AdPlan;
  const navigate = useRouter();
  const [isPreviewPage, setIsPreviewPage] = useState(false);
  const {setPreviewAdData} = useAdStore(state => state);
  const [previewData, setPreviewData] = useState<CreateAdDto>({
    title: '',
    content: '',
    targetUrl: '',
    type: 'sponsored' as AdType,
    section: '',
    callToAction: AdCTA.LearnMore,
    duration: '7' as DurationValue,
    plan: plan,
    price: '',
    imageUrl: '',
    image: null,
  });

  console.log(plan, 'planno');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewData(prev => ({
          ...prev,
          image: file,
          imageUrl: reader.result as string,
          useTextOnly: false,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForApproval = () => {
    setPreviewAdData(previewData);
    setIsPreviewPage(true);
    // toast.success('Your advertisement has been submitted for approval!');
    //navigate.push(`/create-ad/ad-preview`);
  };

  const disablePreviewBtn = () => {
    const {
      title,
      targetUrl,
      imageUrl,
      duration,
      content,
      callToAction,
      section,
      type,
    } = previewData;

    // Only the basic plan requires section
    const requiresSection = plan === 'basic';
    const isCommonInvalid =
      !title || !targetUrl || !duration || (requiresSection && !section);

    if (type === 'sponsored') {
      if (!content || !callToAction || isCommonInvalid) {
        return true; // disable button
      }
    } else if (type === 'banner') {
      if (!imageUrl || isCommonInvalid) {
        return true; // disable button
      }
    }

    return false; // enable button
  };

  let planDescription = '';

  switch (plan) {
    case 'basic':
      planDescription = BASIC_PLAN_DESCRIPTION;
      break;
    case 'professional':
      planDescription = PROFESSIONAL_PLAN_DESCRIPTION;
      break;
    case 'enterprise':
    default:
      planDescription = ENTERPRISE_PLAN_DESCRIPTION;
      break;
  }

  const handleBack = () => {
    navigate.back();
  };

  return (
    <div>
      <PageHeader
        title="Advertise with Us"
        description="Reach our engaged community with targeted advertising"
      />

      <div className="p-4">
        <p className="text-sm text-app-gray mt-2">{planDescription}</p>
      </div>

      {isPreviewPage && <AdPreviewPage setIsPreviewPage={setIsPreviewPage} />}

      {!isPreviewPage && (
        <Fragment>
          {plan === 'enterprise' && (
            <div className="p-4 ">
              <div className="md:flex flex-row flex-wrap gap-8 items-center">
                <div className="mb-5 md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Select Ad Type</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {enterPriseAdTypes.map(type => (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all ${
                          previewData.type === type.id
                            ? 'border-app ring-2 ring-app ring-opacity-50'
                            : ''
                        }`}
                        onClick={() =>
                          // setSelectedAdType(type.id)
                          setPreviewData(prev => ({
                            ...prev,
                            type: type.id as AdType,
                          }))
                        }>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold">{type.name}</h3>
                            {previewData.type === type.id && (
                              <div className="bg-app text-white rounded-full p-1">
                                <CheckCircle size={16} />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-app-gray">
                            {type.description}
                          </p>
                          <p className="text-app font-medium mt-2">
                            {type.price}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="mb-5 md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Select Duration</h2>
                  <Select
                    value={previewData.duration}
                    onValueChange={value => {
                      setPreviewData(prev => ({
                        ...prev,
                        duration: value as DurationValue,
                      }));
                    }}>
                    <SelectTrigger className="w-full md:w-[300px] mb-2">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {enterpriseDurations.map(duration => (
                        <SelectItem key={duration.value} value={duration.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{duration.label}</span>
                            <div className="flex items-center">
                              <span className="font-medium text-app ml-1 mr-3">
                                {duration.price}
                              </span>
                              {duration.discount && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  {duration.discount}
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-5 w-full md:w-[300px] md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Destination URL</h2>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md form-input"
                    value={previewData.targetUrl}
                    onChange={e =>
                      setPreviewData(prev => ({
                        ...prev,
                        targetUrl: e.target.value,
                      }))
                    }
                    placeholder="https://example.com"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Where users will go when they click your ad.
                  </p>
                </div>

                {/* <div className="mb-5 md:mb-0">
              <h2 className="text-lg font-bold mb-4">Target Section</h2>
              <Select
                value={previewData.category}
                onValueChange={value => {
                  console.log(value, 'valueee');

                  setPreviewData(prev => ({...prev, category: value}));
                }}>
                <SelectTrigger className="w-full md:w-[300px] form-input">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {Sections.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
                {previewData.type === 'sponsored' && (
                  <div className="mb-5 w-full md:w-[300px] md:mb-0">
                    <h2 className="text-lg font-bold mb-4">
                      Call to Action Button
                    </h2>
                    <Select
                      value={previewData.callToAction}
                      onValueChange={value => {
                        setPreviewData(prev => ({
                          ...prev,
                          callToAction: value as AdCTA,
                        }));
                      }}>
                      <SelectTrigger className="w-full md:w-[300px] form-input">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {ctaBtn.map(cta => (
                          <SelectItem key={cta.name} value={cta.name}>
                            {cta.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="mb-5 w-full md:w-[300px] md:mb-0">
                  <h2 className="text-lg font-bold mb-4">
                    {previewData.type === 'sponsored'
                      ? 'Ad Image (Optional)'
                      : 'Ad Image'}
                  </h2>
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 flex-1">
                      <Upload size={16} />{' '}
                      {previewData.imageUrl ? 'Change Image' : 'Upload Image'}
                    </Button>

                    {previewData.imageUrl && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setPreviewData(prev => ({
                            ...prev,
                            imageUrl: '',
                            image: null,
                          }))
                        }>
                        Remove
                      </Button>
                    )}
                  </div>

                  {previewData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={previewData.imageUrl}
                        alt="Ad preview"
                        className="h-32 object-contain rounded border p-1 bg-gray-50"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended size: 1200 x 120 pixels.
                  </p>
                </div>

                <div className="mb-5 w-full md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Ad Title</h2>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md form-input"
                    value={previewData.title}
                    onChange={e =>
                      setPreviewData(prev => ({...prev, title: e.target.value}))
                    }
                    placeholder="Discover the Future of AI"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {previewData.title?.length}/50 characters
                  </p>
                </div>

                {previewData.type === 'sponsored' && (
                  <div className="mb-5 w-full md:mb-0">
                    <h2 className="text-lg font-bold mb-4">Ad Description</h2>
                    <textarea
                      className="w-full p-2 border rounded-md min-h-[100px] form-input"
                      value={previewData.content}
                      onChange={e =>
                        setPreviewData(prev => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      maxLength={200}
                      placeholder="Enter your ad description"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {previewData?.content?.length}/200 characters
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {plan === 'professional' && (
            <div className="p-4 ">
              <div className="md:flex flex-row flex-wrap gap-8 items-center">
                <div className="mb-5 md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Select Ad Type</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {professionalAdTypes.map(type => (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all ${
                          previewData.type === type.id
                            ? 'border-app ring-2 ring-app ring-opacity-50'
                            : ''
                        }`}
                        onClick={() =>
                          setPreviewData(prev => ({
                            ...prev,
                            type: type.id as AdType,
                          }))
                        }>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold">{type.name}</h3>
                            {previewData.type === type.id && (
                              <div className="bg-app text-white rounded-full p-1">
                                <CheckCircle size={16} />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-app-gray">
                            {type.description}
                          </p>
                          <p className="text-app font-medium mt-2">
                            {type.price}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="mb-5 md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Select Duration</h2>
                  <Select
                    value={previewData.duration}
                    onValueChange={value => {
                      setPreviewData(prev => ({
                        ...prev,
                        duration: value as DurationValue,
                      }));
                    }}>
                    <SelectTrigger className="w-full md:w-[300px] mb-2">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionalDurations.map(duration => (
                        <SelectItem key={duration.value} value={duration.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{duration.label}</span>
                            <div className="flex items-center">
                              <span className="font-medium text-app ml-1 mr-3">
                                {duration.price}
                              </span>
                              {duration.discount && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  {duration.discount}
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-5 md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Target Section</h2>
                  <Select
                    value={previewData.section}
                    onValueChange={value => {
                      setPreviewData(prev => ({...prev, section: value}));
                    }}>
                    <SelectTrigger className="w-full md:w-[300px] form-input">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {Sections.map(section => (
                        <SelectItem key={section.id} value={section.name}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {previewData.type === 'sponsored' && (
                  <div className="mb-5 w-full md:w-[300px] md:mb-0">
                    <h2 className="text-lg font-bold mb-4">
                      Call to Action Button
                    </h2>
                    <Select
                      value={previewData.callToAction}
                      onValueChange={value => {
                        setPreviewData(prev => ({
                          ...prev,
                          callToAction: value as AdCTA,
                        }));
                      }}>
                      <SelectTrigger className="w-full md:w-[300px] form-input">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {ctaBtn.map(cta => (
                          <SelectItem key={cta.name} value={cta.name}>
                            {cta.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="mb-5 w-full md:w-[300px] md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Destination URL</h2>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md form-input"
                    value={previewData.targetUrl}
                    onChange={e =>
                      setPreviewData(prev => ({
                        ...prev,
                        targetUrl: e.target.value,
                      }))
                    }
                    placeholder="https://example.com"
                  />

                  <p className="text-xs text-muted-foreground mt-2">
                    Where users will go when they click your ad.
                  </p>
                </div>

                <div className="mb-5 w-full md:w-[300px] md:mb-0">
                  <h2 className="text-lg font-bold mb-4">
                    {previewData.type === 'sponsored'
                      ? 'Ad Image (Optional)'
                      : 'Ad Image'}
                  </h2>
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 flex-1">
                      <Upload size={16} />{' '}
                      {previewData.imageUrl ? 'Change Image' : 'Upload Image'}
                    </Button>

                    {previewData.imageUrl && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setPreviewData(prev => ({...prev, imageUrl: ''}))
                        }>
                        Remove
                      </Button>
                    )}
                  </div>

                  {previewData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={previewData.imageUrl}
                        alt="Ad preview"
                        className="h-32 object-contain rounded border p-1 bg-gray-50"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended size: 1200 x 120 pixels.
                  </p>
                </div>

                <div className="mb-5 w-full md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Ad Title</h2>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md form-input"
                    value={previewData.title}
                    onChange={e =>
                      setPreviewData(prev => ({...prev, title: e.target.value}))
                    }
                    placeholder="Discover the Future of AI"
                  />

                  <p className="text-xs text-muted-foreground mt-2">
                    {previewData.title?.length}/50 characters
                  </p>
                </div>

                {previewData.type === 'sponsored' && (
                  <div className="mb-5 w-full md:mb-0">
                    <h2 className="text-lg font-bold mb-4">Ad Description</h2>
                    <textarea
                      className="w-full p-2 border rounded-md min-h-[100px] form-input"
                      value={previewData.content}
                      onChange={e =>
                        setPreviewData(prev => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="Enter your ad description"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {previewData?.content?.length}/200 characters
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {plan === 'basic' && (
            <div className="p-4 ">
              <div className="md:flex flex-row flex-wrap gap-8 items-center">
                <div className="mb-5 md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Select Ad Type</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {basicAdTypes.map(type => (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all ${
                          previewData.type === type.id
                            ? 'border-app ring-2 ring-app ring-opacity-50'
                            : ''
                        }`}
                        onClick={() =>
                          setPreviewData(prev => ({
                            ...prev,
                            type: type.id as AdType,
                          }))
                        }>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold">{type.name}</h3>
                            {previewData.type === type.id && (
                              <div className="bg-app text-white rounded-full p-1">
                                <CheckCircle size={16} />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-app-gray">
                            {type.description}
                          </p>
                          <p className="text-app font-medium mt-2">
                            {type.price}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="mb-5 md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Select Duration</h2>
                  <Select
                    value={previewData.duration}
                    onValueChange={value => {
                      setPreviewData(prev => ({
                        ...prev,
                        duration: value as DurationValue,
                      }));
                    }}>
                    <SelectTrigger className="w-full md:w-[300px] mb-2">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {basicDurations.map(duration => (
                        <SelectItem key={duration.value} value={duration.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{duration.label}</span>
                            <div className="flex items-center">
                              <span className="font-medium text-app ml-1 mr-3">
                                {duration.price}
                              </span>
                              {duration.discount && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  {duration.discount}
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {previewData.type === 'sponsored' && (
                  <div className="mb-5 w-full md:w-[300px] md:mb-0">
                    <h2 className="text-lg font-bold mb-4">
                      Call to Action Button
                    </h2>
                    <Select
                      value={previewData.callToAction}
                      onValueChange={value => {
                        setPreviewData(prev => ({
                          ...prev,
                          callToAction: value as AdCTA,
                        }));
                      }}>
                      <SelectTrigger className="w-full md:w-[300px] form-input">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {ctaBtn.map(cta => (
                          <SelectItem key={cta.name} value={cta.name}>
                            {cta.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="mb-5 md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Target Section</h2>
                  <Select
                    value={previewData.section}
                    onValueChange={value => {
                      setPreviewData(prev => ({...prev, section: value}));
                    }}>
                    <SelectTrigger className="w-full md:w-[300px] form-input">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {Sections.map(section => (
                        <SelectItem key={section.id} value={section.name}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-5 w-full md:w-[300px] md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Destination URL</h2>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md form-input"
                    value={previewData.targetUrl}
                    onChange={e =>
                      setPreviewData(prev => ({
                        ...prev,
                        targetUrl: e.target.value,
                      }))
                    }
                    placeholder="https://example.com"
                  />

                  <p className="text-xs text-muted-foreground mt-2">
                    Where users will go when they click your ad.
                  </p>
                </div>

                <div className="mb-5 w-full md:w-[300px] md:mb-0">
                  <h2 className="text-lg font-bold mb-4">
                    {previewData.type === 'sponsored'
                      ? 'Ad Image (Optional)'
                      : 'Ad Image'}
                  </h2>
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 flex-1">
                      <Upload size={16} />{' '}
                      {previewData.imageUrl ? 'Change Image' : 'Upload Image'}
                    </Button>

                    {previewData.imageUrl && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setPreviewData(prev => ({...prev, imageUrl: ''}))
                        }>
                        Remove
                      </Button>
                    )}
                  </div>

                  {previewData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={previewData.imageUrl}
                        alt="Ad preview"
                        className="h-32 object-contain rounded border p-1 bg-gray-50"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended size: 1200 x 120 pixels.
                  </p>
                </div>

                <div className="mb-5 w-full md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Ad Title</h2>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md form-input"
                    value={previewData.title}
                    onChange={e =>
                      setPreviewData(prev => ({...prev, title: e.target.value}))
                    }
                    placeholder="Discover the Future of AI"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {previewData.title?.length}/50 characters
                  </p>
                </div>

                {previewData.type === 'sponsored' && (
                  <div className="mb-5 w-full md:mb-0">
                    <h2 className="text-lg font-bold mb-4">Ad Description</h2>
                    <textarea
                      className="w-full p-2 border rounded-md min-h-[100px] form-input"
                      value={previewData.content}
                      onChange={e =>
                        setPreviewData(prev => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="Enter your ad description"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {previewData?.content?.length}/200 characters
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mb-8 mx-10">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              disabled={disablePreviewBtn()}
              onClick={handleSubmitForApproval}
              className="bg-app hover:bg-app/90 text-white">
              Preview <ArrowRight className="ml-2" />
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};
